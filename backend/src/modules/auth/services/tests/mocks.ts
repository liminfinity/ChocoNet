import { faker } from '@faker-js/faker';
import { LoginDto, RegisterDto, RequestCodeDto, VerifyCodeDto } from '../../dto';
import { BaseFindUserServiceResponse } from '@/modules/user/services/types';
import { GenerateTokensResponse } from '../../modules/jwtToken/services/types';
import { JwtPayload } from '../../modules/jwtToken';
import { CreateUserResponse } from '@/modules/user/types';

export const mockLogin: LoginDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  rememberMe: faker.datatype.boolean(),
};

export const mockUser: BaseFindUserServiceResponse = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  about: faker.person.bio(),
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

export const mockRegister: RegisterDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [],
};

export const mockCreateUser: CreateUserResponse = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
};

export const mockNewTokens: GenerateTokensResponse = {
  accessToken: faker.string.uuid(),
  refreshToken: faker.string.uuid(),
};

export const mockPayload: JwtPayload = {
  sub: faker.string.uuid(),
  email: faker.internet.email(),
};

export const mockVerifyCode: VerifyCodeDto = {
  email: faker.internet.email(),
  code: faker.string.numeric(6),
};

export const mockRequestNewCode: RequestCodeDto = {
  email: faker.internet.email(),
};
