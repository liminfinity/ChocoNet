import type { User } from '@prisma/client';

type AuthControllerResponse = Omit<User, 'password'>;

export type LoginControllerResponse = AuthControllerResponse;

export type RefreshControllerResponse = AuthControllerResponse;
