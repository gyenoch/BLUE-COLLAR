import winston from 'winston';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const isDev = process.env.NODE_ENV === 'development';

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'blue-collar-api' },
  transports: [
    new winston.transports.Console({
      format: isDev ? combine(colorize(), simple()) : combine(timestamp(), json()),
    }),
  ],
});

/** Returns a logger child with a module label on every line */
export function createLogger(module: string) {
  return logger.child({ module });
}
