import { format } from 'winston';

export const errorFilter = format((info) => {
  return info.level === 'error' ? info : false;
});
