import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import { createMediaStreamServer } from './modules/voice/websocket.handler';
import { testDatabaseConnection } from './config/database.config';
import { testRedisConnection } from './config/redis.config';
import { env } from './config/env.config';
import { createLogger } from './utils/logger';

const log = createLogger('server');

async function bootstrap(): Promise<void> {
  // ─── Validate external connections ──────────────────────────────────────────
  await testDatabaseConnection();
  await testRedisConnection();

  // ─── HTTP server ─────────────────────────────────────────────────────────────
  const server = http.createServer(app);

  // ─── WebSocket server for Twilio Media Streams ────────────────────────────
  // Twilio connects to wss://<host>/api/voice/stream
  // We create a standalone WS server (noServer: true) and attach it manually
  // to the HTTP upgrade event so Express and WS share the same port.
  const wss = new WebSocketServer({ noServer: true });
  createMediaStreamServer(wss);

  server.on('upgrade', (request, socket, head) => {
    const { url } = request;
    if (url?.startsWith('/api/voice/stream')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  // ─── Start listening ──────────────────────────────────────────────────────
  const PORT = env.PORT ?? 3001;

  server.listen(PORT, () => {
    log.info(`API server listening`, {
      port: PORT,
      env: env.NODE_ENV,
      wsPath: '/api/voice/stream',
    });
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    log.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      log.info('HTTP server closed');
      process.exit(0);
    });

    // Force-kill after 10 s if connections linger
    setTimeout(() => {
      log.warn('Forcing shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
