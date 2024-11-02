import { transports, format } from 'winston';
import { errorFilter, fileFormat, infoFilter } from '../formats';
import { resolve } from 'node:path';
import 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

const { combine } = format;

const FILE_DEFAULT_OPTIONS = {
  dirname: resolve('logs'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  createSymlink: true,
  symlinkName: 'latest',
  extension: '.log',
  maxSize: '10m',
  maxFiles: '7d',
} satisfies DailyRotateFileTransportOptions;

export const combinedFileTransport = new transports.DailyRotateFile({
  ...FILE_DEFAULT_OPTIONS,
  filename: 'combined-%DATE%',
});

export const errorFileTransport = new transports.DailyRotateFile({
  ...FILE_DEFAULT_OPTIONS,
  filename: 'error-%DATE%',
  format: combine(errorFilter(), fileFormat),
});

export const infoFileTransport = new transports.DailyRotateFile({
  ...FILE_DEFAULT_OPTIONS,
  filename: 'info-%DATE%',
  format: combine(infoFilter(), fileFormat),
});
