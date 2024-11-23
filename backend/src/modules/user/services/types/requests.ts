import { VerifyAndUpdatePasswordDto } from '../../dto';

export type VerifyAndUpdatePasswordServiceRequest = Omit<
  VerifyAndUpdatePasswordDto,
  'confirmPassword'
>;
