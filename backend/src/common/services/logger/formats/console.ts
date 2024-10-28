import { format } from 'winston';
import { levelUpperCase } from '../formats';

const { combine, colorize, printf, timestamp, align, errors } = format;

export const consoleFormat = combine(
  levelUpperCase(),
  errors({ stack: true }),
  timestamp({ format: 'HH:mm:ss' }),
  colorize({ all: true }),
  align(),
  printf(({ level, timestamp, message, stack }) => {
    return stack ? `\n[${timestamp}] ${level}:\n${stack}` : `[${timestamp}] ${level}: ${message}`;
  }),
);
