import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from '@/common/modules';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UserService } from '@/modules/user';
import {
  mockCreateUserRequest,
  mockCreateUserResponse,
  mockNewPassword,
  mockRepositoryUser,
  mockRepositoryUserWithNewPassword,
  mockServiceUser,
  mockServiceUserWithNewPassword,
} from './mocks';
import { UserRepository } from '../../repositories';

describe('Сервис пользователя', () => {
  let userService: UserService;
  let userRepository: DeepMocked<UserRepository>;
  let hashService: DeepMocked<HashService>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker(createMock)
      .compile();

    userService = moduleFixture.get(UserService);
    userRepository = moduleFixture.get(UserRepository);
    hashService = moduleFixture.get(HashService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Получение пользователя по email', () => {
    it('Пользователь найден', async () => {
      userRepository.findByEmail.mockResolvedValue(mockRepositoryUser);

      const user = await userService.findByEmail(mockRepositoryUser.email);

      expect(user).toEqual(mockServiceUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockRepositoryUser.email);
    });

    it('Пользователь не найден', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const user = await userService.findByEmail(mockRepositoryUser.email);

      expect(user).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockRepositoryUser.email);
    });
  });

  describe('Получение пользователя по ID', () => {
    it('Пользователь найден', async () => {
      userRepository.findById.mockResolvedValue(mockRepositoryUser);

      const user = await userService.findById(mockRepositoryUser.id);

      expect(user).toEqual(mockServiceUser);
      expect(userRepository.findById).toHaveBeenCalledWith(mockRepositoryUser.id);
    });

    it('Пользователь не найден', async () => {
      userRepository.findById.mockResolvedValue(null);

      const user = await userService.findById(mockRepositoryUser.id);

      expect(user).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith(mockRepositoryUser.id);
    });
  });

  describe('Создание пользователя', () => {
    it('Пользователь создан', async () => {
      userRepository.create.mockResolvedValue(mockCreateUserResponse);
      hashService.hash.mockResolvedValue(mockCreateUserRequest.password);
      const user = await userService.create(mockCreateUserRequest);

      expect(user).toEqual(mockCreateUserResponse);
      expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserRequest);
      expect(hashService.hash).toHaveBeenCalledWith(mockCreateUserRequest.password);
    });
  });

  describe('Смена пароля', () => {
    it('Пароль изменен', async () => {
      userRepository.updatePassword.mockResolvedValue(undefined);
      hashService.hash.mockResolvedValue(mockNewPassword);
      userRepository.findById.mockResolvedValue(mockRepositoryUserWithNewPassword);

      await userService.updatePassword(mockRepositoryUserWithNewPassword.email, mockNewPassword);

      const user = await userService.findById(mockRepositoryUserWithNewPassword.id);

      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        mockRepositoryUserWithNewPassword.email,
        mockNewPassword,
      );
      expect(hashService.hash).toHaveBeenCalledWith(mockNewPassword);
      expect(user).toEqual(mockServiceUserWithNewPassword);
    });
  });
});
