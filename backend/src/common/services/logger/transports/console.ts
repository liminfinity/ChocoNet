import { transports } from 'winston';
import { consoleFormat } from '../formats';

export const consoleTransport = new transports.Console({
  format: consoleFormat,
});
