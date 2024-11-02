import { VerificationCode } from '@prisma/client';

type BaseVerificationСodeRequest = Pick<VerificationCode, 'email' | 'code' | 'type'>;

export type SaveVerificationCodeRequest = BaseVerificationСodeRequest;

export type UpdateVerificationCodeRequest = BaseVerificationСodeRequest;

export type DeleteVerificationCodeRequest = Omit<BaseVerificationСodeRequest, 'code'>;

export type VerifyCodeRequest = BaseVerificationСodeRequest;
