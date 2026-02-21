import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { parse as parseUrl } from 'url';
import { TwilioMediaMessage, ActiveCall } from './types';
import { createDeepgramConnection } from '../conversation/clients/deepgram.client';
import { ConversationService } from '../conversation/conversation.service';
import { sendAudioToTwilio, clearTwilioAudioBuffer } from './audio-stream.service';
import { pool } from '../../config/database.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('websocket-handler');
const conversationService = new ConversationService();

// Track active calls
const activeCalls = new Map<string, ActiveCall>();

/**
 * Attach WebSocket upgrade handler to the HTTP server.
 * Twilio media streams connect to /media-stream?businessId=xxx
 */
export function createMediaStreamServer(wss: WebSocketServer): void {
  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const query = parseUrl(req.url ?? '', true).query;
    const businessId = (query.businessId as string) || '';

    log.info('WebSocket client connected', { businessId });

    let streamSid = '';
    let callSid = '';
    let isProcessing = false; // Prevent overlapping Claude calls

    // ─── Deepgram connection ──────────────────────────────────
    const deepgram = createDeepgramConnection();
    let transcriptBuffer = '';
    let finalTranscriptTimer: NodeJS.Timeout | null = null;

    deepgram.onTranscript((text, isFinal) => {
      if (!text.trim()) return;

      transcriptBuffer = text;

      if (isFinal) {
        // Clear debounce timer and process immediately
        if (finalTranscriptTimer) clearTimeout(finalTranscriptTimer);
        processTranscriptNow(text);
      } else {
        // If customer is still speaking, debounce processing by 800ms
        if (finalTranscriptTimer) clearTimeout(finalTranscriptTimer);
        finalTranscriptTimer = setTimeout(() => {
          if (transcriptBuffer.trim()) processTranscriptNow(transcriptBuffer);
        }, 800);
      }
    });

    // Interrupt handling: customer speaks while AI is talking
    deepgram.onSpeechStart(() => {
      if (streamSid && callSid) {
        // Clear the AI's outgoing audio so customer isn't talking over it
        clearTwilioAudioBuffer(ws, streamSid);
        log.debug('Customer interrupted AI', { callSid });
      }
    });

    deepgram.onError((err) => {
      log.error('Deepgram error', { callSid, error: err.message });
    });

    // ─── Process customer speech ──────────────────────────────
    async function processTranscriptNow(text: string): Promise<void> {
      if (!callSid || isProcessing || !text.trim()) return;
      isProcessing = true;
      transcriptBuffer = '';

      try {
        log.info('Customer said', { callSid, text });
        const result = await conversationService.processTranscript(callSid, text);
        if (result && streamSid) {
          sendAudioToTwilio(ws, streamSid, result.audioBase64);
          log.info('AI responded', { callSid, text: result.text.slice(0, 60) });
        }
      } catch (err) {
        log.error('Error processing transcript', { callSid, error: (err as Error).message });
      } finally {
        isProcessing = false;
      }
    }

    // ─── Handle Twilio media stream messages ─────────────────
    ws.on('message', async (data: WebSocket.RawData) => {
      let msg: TwilioMediaMessage;
      try {
        msg = JSON.parse(data.toString()) as TwilioMediaMessage;
      } catch {
        return;
      }

      switch (msg.event) {
        case 'start': {
          streamSid = msg.start!.streamSid;
          callSid = msg.start!.callSid;
          const customerPhone = msg.start!.customParameters?.customerPhone ?? '';

          log.info('Stream started', { callSid, streamSid, businessId });
          activeCalls.set(callSid, {
            callSid,
            streamSid,
            businessId,
            customerPhone,
            startedAt: new Date(),
          });

          // Save call record to DB
          await saveCallRecord(callSid, businessId, customerPhone);

          // Send greeting immediately
          try {
            const greeting = await conversationService.generateGreeting(
              callSid,
              businessId,
              customerPhone
            );
            sendAudioToTwilio(ws, streamSid, greeting.audioBase64);
            log.info('Greeting sent', { callSid });
          } catch (err) {
            log.error('Failed to send greeting', { callSid, error: (err as Error).message });
          }
          break;
        }

        case 'media': {
          // Forward audio to Deepgram for transcription
          if (msg.media?.payload) {
            const audio = Buffer.from(msg.media.payload, 'base64');
            deepgram.send(audio);
          }
          break;
        }

        case 'stop': {
          log.info('Stream stopped', { callSid });

          // Clear any pending timer
          if (finalTranscriptTimer) clearTimeout(finalTranscriptTimer);

          // Process any remaining transcript
          if (transcriptBuffer.trim()) {
            await processTranscriptNow(transcriptBuffer);
          }

          // Cleanup
          deepgram.finish();
          const finalState = await conversationService.cleanup(callSid);
          activeCalls.delete(callSid);

          // Save final call data
          if (finalState) {
            await finalizeCallRecord(callSid, finalState);
          }
          break;
        }

        case 'mark': {
          // AI finished speaking — ready for next customer input
          log.debug('Mark received', { callSid, name: msg.mark?.name });
          break;
        }
      }
    });

    ws.on('error', (err) => {
      log.error('WebSocket error', { callSid, error: err.message });
    });

    ws.on('close', () => {
      log.info('WebSocket closed', { callSid });
      deepgram.finish();
      if (finalTranscriptTimer) clearTimeout(finalTranscriptTimer);
      activeCalls.delete(callSid);
    });
  });
}

async function saveCallRecord(callSid: string, businessId: string, customerPhone: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO calls (business_id, customer_phone, call_sid, direction, created_at)
       VALUES ($1, $2, $3, 'inbound', NOW())
       ON CONFLICT (call_sid) DO NOTHING`,
      [businessId || null, customerPhone, callSid]
    );
  } catch (err) {
    log.warn('Failed to save call record', { callSid, error: (err as Error).message });
  }
}

async function finalizeCallRecord(callSid: string, state: any): Promise<void> {
  if (!state) return;
  try {
    const transcript = state.messages
      .map((m: any) => `${m.role === 'user' ? 'Customer' : 'AI'}: ${m.content}`)
      .join('\n');

    await pool.query(
      `UPDATE calls
       SET transcript = $1, conversation_history = $2, language = $3,
           urgency = $4, duration = $5
       WHERE call_sid = $6`,
      [
        transcript,
        JSON.stringify(state.messages),
        state.language,
        state.urgency ?? null,
        Math.round((Date.now() - state.startedAt.getTime()) / 1000),
        callSid,
      ]
    );
  } catch (err) {
    log.warn('Failed to finalize call record', { callSid, error: (err as Error).message });
  }
}

export function getActiveCalls(): Map<string, ActiveCall> {
  return activeCalls;
}
