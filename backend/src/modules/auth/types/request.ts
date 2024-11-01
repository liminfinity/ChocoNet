import { Request } from 'express';
import { UserFromToken } from '../strategies';

export type RequestWithUser = Request & {
  user: UserFromToken;
};
