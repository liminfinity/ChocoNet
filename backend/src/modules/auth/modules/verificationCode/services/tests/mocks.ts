import { faker } from '@faker-js/faker';
import {
  DeleteVerificationCodeRequest,
  SaveVerificationCodeRequest,
  VerifyCodeRequest,
} from '../../types';
import { VerificationCodeType } from '@prisma/client';

export const mockEmailConfirmation: SaveVerificationCodeRequest = {
  email: faker.internet.email(),
  code: faker.string.numeric(6),
  type: VerificationCodeType.EMAIL_CONFIRMATION,
};

export const mockDeleteVerificationCode: DeleteVerificationCodeRequest = {
  email: faker.internet.email(),
  type: VerificationCodeType.EMAIL_CONFIRMATION,
};

export const mockVerifyCode: VerifyCodeRequest = {
  code: faker.string.numeric(6),
  email: faker.internet.email(),
  type: VerificationCodeType.PASSWORD_RESET,
};

export const mockEmail = faker.internet.email();
