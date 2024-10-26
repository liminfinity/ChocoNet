import type { User } from '@prisma/client';

type AuthControllerResponse = Omit<User, 'password' | 'updatedAt' | 'id'>;

export type LoginControllerResponse = AuthControllerResponse;

export type RefreshControllerResponse = AuthControllerResponse;

export type VerifyCodeControllerResponse = AuthControllerResponse;
