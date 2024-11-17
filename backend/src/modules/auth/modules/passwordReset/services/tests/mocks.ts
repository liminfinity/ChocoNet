import { RequestCodeDto, VerifyCodeDto } from '@/modules/auth/dto';
import { faker } from '@faker-js/faker/.';
import { UpdatePasswordDto } from '../../dto';
import { BaseFindUserServiceResponse } from '@/modules/user/services/types';
import { GenerateTokensResponse } from '../../../jwtToken/services/types';

export const mockEmail = faker.internet.email();

export const mockRequestNewCode: RequestCodeDto = {
  email: faker.internet.email(),
};
export const mockVerifyCode: VerifyCodeDto = {
  email: faker.internet.email(),
  code: faker.string.numeric(6),
};
export const mockUpdatePassword: UpdatePasswordDto = {
  email: faker.internet.email(),
  newPassword: faker.internet.password(),
  confirmPassword: faker.internet.password(),
  logoutFromOtherDevices: faker.datatype.boolean(),
};

export const mockUser: NonNullable<BaseFindUserServiceResponse> = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  nickname: faker.internet.username(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [
    {
      id: faker.string.uuid(),
      path: faker.image.url(),
    },
  ],
};

export const mockVerificationCode = faker.string.numeric(6);

export const mockNewTokens: GenerateTokensResponse = {
  accessToken: faker.string.uuid(),
  refreshToken: faker.string.uuid(),
};
