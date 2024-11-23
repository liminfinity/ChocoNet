import { User, VerificationCode } from '@prisma/client';

export type GetExpiredCodesRepositoryResponse = (Pick<
  VerificationCode,
  'code' | 'email' | 'id' | 'type'
> & {
  user: Pick<User, 'email' | 'id'>;
})[];
