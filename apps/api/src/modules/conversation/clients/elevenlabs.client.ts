import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { env } from '../../../config/env.config';
import { createLogger } from '../../../utils/logger';

const log = createLogger('elevenlabs-client');

const elevenlabs = new ElevenLabsClient({ apiKey: env.ELEVENLABS_API_KEY });

// Voice ID — "Rachel" by default (clear, professional American English)
const DEFAULT_VOICE_ID = env.ELEVENLABS_VOICE_ID;

/**
 * Convert text to speech and return audio buffer in μ-law 8kHz format
 * (directly compatible with Twilio media streams).
 */
export async function textToSpeech(
  text: string,
  voiceId = DEFAULT_VOICE_ID
): Promise<Buffer> {
  try {
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      modelId: 'eleven_turbo_v2_5',  // Lowest latency model
      outputFormat: 'ulaw_8000',      // Twilio-compatible format
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.8,
        style: 0.1,
        useSpeakerBoost: true,
      },
    });

    // ReadableStream (Web Streams API) — use getReader() instead of for-await
    const reader = audioStream.getReader();
    const chunks: Buffer[] = [];
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }

    const audio = Buffer.concat(chunks);
    log.debug('TTS generated', { chars: text.length, bytes: audio.length });
    return audio;
  } catch (err) {
    log.error('ElevenLabs TTS failed', { error: (err as Error).message });
    throw err;
  }
}

/**
 * Convert audio buffer to base64 string for Twilio WebSocket.
 */
export function audioToBase64(audio: Buffer): string {
  return audio.toString('base64');
}
