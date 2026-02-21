import WebSocket from 'ws';
import { TwilioOutboundMessage } from './types';
import { createLogger } from '../../utils/logger';

const log = createLogger('audio-stream');

const CHUNK_SIZE = 160 * 20; // ~20ms chunks at 8kHz

/**
 * Send base64-encoded μ-law audio back to Twilio via WebSocket.
 * Splits large buffers into chunks to avoid WebSocket frame limits.
 */
export function sendAudioToTwilio(
  ws: WebSocket,
  streamSid: string,
  audioBase64: string
): void {
  if (ws.readyState !== WebSocket.OPEN) {
    log.warn('WebSocket not open, dropping audio', { streamSid });
    return;
  }

  // Split into chunks (full audio can be several seconds long)
  const audioBuffer = Buffer.from(audioBase64, 'base64');
  const totalChunks = Math.ceil(audioBuffer.length / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const chunk = audioBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const msg: TwilioOutboundMessage = {
      event: 'media',
      streamSid,
      media: { payload: chunk.toString('base64') },
    };
    ws.send(JSON.stringify(msg));
  }

  // Send a mark so we know when Twilio finishes playing
  const markMsg: TwilioOutboundMessage = {
    event: 'mark',
    streamSid,
    mark: { name: `ai_speech_${Date.now()}` },
  };
  ws.send(JSON.stringify(markMsg));

  log.debug('Audio sent to Twilio', { streamSid, chunks: totalChunks, bytes: audioBuffer.length });
}

/**
 * Clear Twilio's audio buffer (used when customer interrupts AI).
 */
export function clearTwilioAudioBuffer(ws: WebSocket, streamSid: string): void {
  if (ws.readyState !== WebSocket.OPEN) return;
  const msg: TwilioOutboundMessage = { event: 'clear', streamSid };
  ws.send(JSON.stringify(msg));
  log.debug('Audio buffer cleared', { streamSid });
}
