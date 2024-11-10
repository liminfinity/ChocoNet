import { Request } from 'express';
import { UserFromToken } from '../strategies';

export type RequestWithUser = Omit<Request, 'user'> & { user: UserFromToken };
