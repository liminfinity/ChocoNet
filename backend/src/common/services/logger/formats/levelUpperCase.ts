import { format } from 'winston';

export const levelUpperCase = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});
