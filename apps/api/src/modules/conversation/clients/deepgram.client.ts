import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { env } from '../../../config/env.config';
import { createLogger } from '../../../utils/logger';

const log = createLogger('deepgram-client');

const deepgram = createClient(env.DEEPGRAM_API_KEY);

export interface DeepgramConnection {
  send(audio: Buffer): void;
  finish(): void;
  onTranscript(callback: (text: string, isFinal: boolean) => void): void;
  onSpeechStart(callback: () => void): void;
  onUtteranceEnd(callback: () => void): void;
  onError(callback: (err: Error) => void): void;
  onClose(callback: () => void): void;
}

/**
 * Create a live Deepgram transcription connection.
 * Twilio sends μ-law encoded audio at 8kHz mono.
 */
export function createDeepgramConnection(language = 'en'): DeepgramConnection {
  const connection = deepgram.listen.live({
    model: 'nova-2',
    language: language === 'es' ? 'es' : 'en-US',
    encoding: 'mulaw',
    sample_rate: 8000,
    channels: 1,
    interim_results: true,
    utterance_end_ms: 1000,
    vad_events: true,
    endpointing: 300,
    smart_format: true,
    no_delay: true,
  });

  let transcriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
  let speechStartCallback: (() => void) | null = null;
  let utteranceEndCallback: (() => void) | null = null;
  let errorCallback: ((err: Error) => void) | null = null;
  let closeCallback: (() => void) | null = null;

  connection.on(LiveTranscriptionEvents.Open, () => {
    log.debug('Deepgram connection opened');
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    const transcript = data?.channel?.alternatives?.[0]?.transcript ?? '';
    if (!transcript) return;
    const isFinal = data.is_final ?? false;
    transcriptCallback?.(transcript, isFinal);
  });

  connection.on(LiveTranscriptionEvents.SpeechStarted, () => {
    speechStartCallback?.();
  });

  connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
    utteranceEndCallback?.();
  });

  connection.on(LiveTranscriptionEvents.Error, (err: Error) => {
    log.error('Deepgram error', { error: err.message });
    errorCallback?.(err);
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    log.debug('Deepgram connection closed');
    closeCallback?.();
  });

  return {
    send(audio: Buffer) {
      if (connection.getReadyState() === 1) {
        connection.send(audio as unknown as any);
      }
    },
    finish() {
      connection.finish();
    },
    onTranscript(cb) {
      transcriptCallback = cb;
    },
    onSpeechStart(cb) {
      speechStartCallback = cb;
    },
    onUtteranceEnd(cb) {
      utteranceEndCallback = cb;
    },
    onError(cb) {
      errorCallback = cb;
    },
    onClose(cb) {
      closeCallback = cb;
    },
  };
}
