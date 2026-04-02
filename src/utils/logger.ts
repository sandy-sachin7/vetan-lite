import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';

const isDev = process.env.NODE_ENV !== 'production';

export const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

const asyncStorage = new AsyncLocalStorage<pino.Logger>();

export const logger = new Proxy(baseLogger, {
  get(target, prop, receiver) {
    const store = asyncStorage.getStore();
    const activeTarget = store || target;
    const value = Reflect.get(activeTarget, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(activeTarget);
    }
    return value;
  },
});

export function withLogger<T>(
  correlationId: string,
  metadata: Record<string, any>,
  fn: () => Promise<T>
): Promise<T> {
  const childLogger = baseLogger.child({ traceId: correlationId, ...metadata });
  return asyncStorage.run(childLogger, fn);
}
