import { format } from 'winston';

export const infoFilter = format((info) => {
  return info.level === 'info' ? info : false;
});
