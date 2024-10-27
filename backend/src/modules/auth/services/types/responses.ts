import { UserDto } from '@/modules/user/dto';

export type AuthServiceResponse = {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
};

export type LoginServiceResponse = AuthServiceResponse;

export type RefreshServiceResponse = AuthServiceResponse;

export type VerifyCodeServiceResponse = AuthServiceResponse;
