import { ENV, IS_DEV } from '@/common/constants';
import { WinstonModule } from 'nest-winston';
import { combinedFileTransport, consoleTransport, errorFileTransport } from './transports';
import { infoFileTransport } from './transports/files';

export const LoggerService = WinstonModule.createLogger({
  level: ENV.LOG_LEVEL || 'info',
  transports: [
    ...(IS_DEV ? [consoleTransport] : []),
    combinedFileTransport,
    errorFileTransport,
    infoFileTransport,
  ],
});
