import { format } from 'winston';

const { combine, timestamp, errors, json } = format;

export const fileFormat = combine(
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  json(),
);
