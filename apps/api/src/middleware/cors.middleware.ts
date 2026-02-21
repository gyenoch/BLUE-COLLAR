import cors from 'cors';
import { env } from '../config/env.config';

const allowedOrigins =
  env.NODE_ENV === 'production'
    ? ['https://bluecollaragent.com', 'https://www.bluecollaragent.com', 'https://app.bluecollaragent.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
