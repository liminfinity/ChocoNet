import { User } from '@prisma/client';

type BaseVerificationСodeRequest = {
  code: string;
} & Pick<User, 'email'>;

export type SaveVerificationCodeRequest = BaseVerificationСodeRequest;

export type DeleteVerificationCodeRequest = BaseVerificationСodeRequest;

export type VerifyCodeRequest = BaseVerificationСodeRequest;
