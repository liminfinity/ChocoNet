import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest';
import { UserService } from '../user.service';
import { UserRepository } from '../../repositories';
import { HashService } from '@/common/modules';
import { PastryLikeService, PastryMediaService } from '@/modules/pastry/modules';
import { UserAvatarService, UserFollowService } from '../../modules';
import { PastryService } from '@/modules/pastry/services';
import { JwtTokenService } from '@/modules/auth/modules';
import {
  mockHashedPassword,
  mockUser,
  mockProfile,
  mockCreateUserRequest,
  mockGuestProfile,
  mockOtherProfile,
  mockSelfProfile,
  mockUserId,
  mockGetUserPastries,
  mockQuery,
  mockAvatarsToRemove,
  mockPastryIds,
  mockPastryMediaToRemove,
  mockUpdatePassword,
  mockUpdateUserDto,
} from './mocks';
import { mapAvatarsToPaths } from '../../lib';
import { getFormattedGeolocation } from '@/modules/pastry/lib';
import { mapFilesToFilenames } from '@/common/lib';
import { faker } from '@faker-js/faker';
import omit from 'lodash.omit';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

jest.mock('@/modules/pastry/lib/getFormattedGeolocation', () => ({
  getFormattedGeolocation: jest.fn(),
}));

describe('Сервис пользователей', () => {
  let userService: UserService;
  let userRepository: DeepMocked<UserRepository>;
  let hashService: DeepMocked<HashService>;
  let pastryLikeService: DeepMocked<PastryLikeService>;
  let userAvatarService: DeepMocked<UserAvatarService>;
  let pastryService: DeepMocked<PastryService>;
  let userFollowService: DeepMocked<UserFollowService>;
  let jwtTokenService: DeepMocked<JwtTokenService>;
  let pastryMediaService: DeepMocked<PastryMediaService>;
  let cacheManager: DeepMocked<Cache>;

  beforeAll(async () => {
    const cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    } satisfies Partial<Cache>;

    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: CACHE_MANAGER, useValue: cacheManagerMock }],
    })
      .useMocker(createMock)
      .compile();

    userService = moduleFixtures.get(UserService);
    userRepository = moduleFixtures.get(UserRepository);
    hashService = moduleFixtures.get(HashService);
    pastryLikeService = moduleFixtures.get(PastryLikeService);
    userAvatarService = moduleFixtures.get(UserAvatarService);
    pastryService = moduleFixtures.get(PastryService);
    userFollowService = moduleFixtures.get(UserFollowService);
    jwtTokenService = moduleFixtures.get(JwtTokenService);
    pastryMediaService = moduleFixtures.get(PastryMediaService);
    cacheManager = moduleFixtures.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Найти пользователя по email', () => {
    it('Должен вернуть пользователя, если он найден', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.findByEmail(mockUser.email);

      expect(result).toEqual({
        ...mockUser,
        avatars: mapAvatarsToPaths(mockUser.avatars),
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('Должен вернуть null, если пользователь не найден', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.findByEmail(mockUser.email);

      expect(result).toBeNull();
    });
  });

  describe('Найти пользователя по id', () => {
    it('Должен вернуть пользователя по id', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById(mockUser.id);

      expect(result).toEqual({ ...mockUser, avatars: mapAvatarsToPaths(mockUser.avatars) });
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it('Должен вернуть null, если пользователь не найден', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      userRepository.findById.mockResolvedValue(null);

      const result = await userService.findById(mockUser.id);

      expect(result).toBeNull();
    });
  });

  describe('Найти пользователя по nickname', () => {
    it('Должен вернуть пользователя по nickname', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      userRepository.findByNickname.mockResolvedValue(mockUser);

      const result = await userService.findByNickname(mockUser.nickname);

      expect(result).toEqual({ ...mockUser, avatars: mapAvatarsToPaths(mockUser.avatars) });
      expect(userRepository.findByNickname).toHaveBeenCalledWith(mockUser.nickname);
    });

    it('Должен вернуть null, если пользователь не найден', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      userRepository.findByNickname.mockResolvedValue(null);

      const result = await userService.findByNickname(mockUser.nickname);

      expect(result).toBeNull();
    });
  });

  describe('Создание пользователя', () => {
    it('Должен создать нового пользователя', async () => {
      hashService.hash.mockResolvedValue(mockHashedPassword);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await userService.create(mockCreateUserRequest);

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...mockCreateUserRequest,
        password: mockHashedPassword,
      });
    });
  });

  describe('Обновление пароля', () => {
    it('Должен обновить пароль пользователя', async () => {
      hashService.hash.mockResolvedValue(mockHashedPassword);
      userRepository.updatePassword.mockResolvedValue(undefined);

      await userService.updatePassword(mockUser.id, mockUser.password);

      expect(userRepository.updatePassword).toHaveBeenCalledWith(mockUser.id, mockHashedPassword);
    });
  });

  describe('Получить профиль пользователя', () => {
    it('Должен вернуть профиль пользователя для авторизованного пользователя', async () => {
      userRepository.getProfile.mockResolvedValue(mockProfile);
      pastryLikeService.getReceivedLikesCount.mockResolvedValue(mockOtherProfile._count.likes);

      (getFormattedGeolocation as jest.Mock).mockResolvedValue(mockOtherProfile.geolocation);

      userFollowService.isFollowing.mockResolvedValue(mockOtherProfile.isFollowing);

      const result = await userService.getProfile(mockUser.id, faker.string.uuid());

      expect(result).toEqual(mockOtherProfile);
      expect(userRepository.getProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('Должен вернуть мой профиль', async () => {
      userRepository.getProfile.mockResolvedValue(mockProfile);
      pastryLikeService.getReceivedLikesCount.mockResolvedValue(mockSelfProfile._count.likes);

      (getFormattedGeolocation as jest.Mock).mockResolvedValue(mockSelfProfile.geolocation);

      const result = await userService.getProfile(mockUser.id, mockUser.id);

      expect(result).toEqual(mockSelfProfile);
      expect(userRepository.getProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('Должен вернуть профиль пользователя для неавторизованного пользователя', async () => {
      userRepository.getProfile.mockResolvedValue(mockProfile);
      pastryLikeService.getReceivedLikesCount.mockResolvedValue(mockGuestProfile._count.likes);

      const result = await userService.getProfile(mockUser.id);

      expect(result).toEqual(mockGuestProfile);
      expect(userRepository.getProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('Должен выбросить NotFoundException, если пользователь не найден', async () => {
      userRepository.getProfile.mockResolvedValue(null);

      await expect(userService.getProfile(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Получение списка кондитерских изделий пользователя', () => {
    it('Должен вернуть список кондитерских изделий пользователя', async () => {
      pastryService.getUserPastries.mockResolvedValue(mockGetUserPastries);

      const result = await userService.getUserPastries(mockQuery, mockUserId);

      expect(result).toEqual(mockGetUserPastries);
      expect(pastryService.getUserPastries).toHaveBeenCalledWith(mockQuery, mockUserId, undefined);
    });
  });

  describe('Удаление пользователя', () => {
    it('Успешное удаление пользователя и всех связанных данных', async () => {
      userRepository.delete.mockResolvedValue(undefined);
      userAvatarService.findByUserId.mockResolvedValue(mockAvatarsToRemove);
      pastryService.getPastryIdsByUserId.mockResolvedValue(mockPastryIds);
      pastryMediaService.findByPastryId.mockResolvedValue(mockPastryMediaToRemove);

      await userService.delete(mockUserId);

      expect(userRepository.delete).toHaveBeenCalledWith(mockUserId);
      expect(userAvatarService.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(pastryService.getPastryIdsByUserId).toHaveBeenCalledWith(mockUserId);
      expect(pastryMediaService.findByPastryId).toHaveBeenCalledTimes(mockPastryIds.length);
      for (let i = 0; i < mockPastryIds.length; i++) {
        expect(pastryMediaService.findByPastryId).toHaveBeenCalledWith(mockPastryIds[i]);
      }
    });
  });

  describe('Проверка и обновление пароля', () => {
    it('Успешное обновление пароля, если старый пароль верен', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      jwtTokenService.deleteRefreshTokensByUserId.mockResolvedValue(undefined);
      const updatePasswordSpy = jest.spyOn(userService, 'updatePassword');

      await userService.verifyAndUpdatePassword(mockUserId, mockUpdatePassword);

      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(hashService.compare).toHaveBeenCalledWith(
        mockUpdatePassword.oldPassword,
        mockUser.password,
      );

      expect(updatePasswordSpy).toHaveBeenCalledWith(mockUser.id, mockUpdatePassword.newPassword);
    });

    it('Должно выброситься BadRequestException, если старый пароль неверен', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);

      await expect(
        userService.verifyAndUpdatePassword(mockUserId, mockUpdatePassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('Должно выброситься NotFoundException, если пользователь не найден', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        userService.verifyAndUpdatePassword(mockUserId, mockUpdatePassword),
      ).rejects.toThrow(NotFoundException);
    });

    it('Должен не удалять токены, если не требуется выход из других устройств', async () => {
      hashService.compare.mockResolvedValue(true);
      userRepository.findById.mockResolvedValue(mockUser);
      jwtTokenService.deleteRefreshTokensByUserId.mockResolvedValue(undefined);

      await userService.verifyAndUpdatePassword(mockUserId, {
        ...mockUpdatePassword,
        logoutFromOtherDevices: false,
      });

      expect(jwtTokenService.deleteRefreshTokensByUserId).not.toHaveBeenCalled();
    });
  });

  describe('Обновление пользователя', () => {
    it('Успешное обновление данных пользователя', async () => {
      userRepository.findByEmail.mockResolvedValue(null); // Нет другого пользователя с таким email
      userRepository.findByNickname.mockResolvedValue(null); // Нет другого пользователя с таким nickname
      userRepository.update.mockResolvedValue(undefined); // Успешное обновление

      userAvatarService.findByIds.mockResolvedValue([]);

      await userService.update(mockUserId, mockUpdateUserDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUpdateUserDto.email);
      expect(userRepository.findByNickname).toHaveBeenCalledWith(mockUpdateUserDto.nickname);
      expect(userRepository.update).toHaveBeenCalledWith(mockUserId, {
        ...mockUpdateUserDto,
        avatars: mockUpdateUserDto.avatars && mapFilesToFilenames(mockUpdateUserDto.avatars),
      });
    });

    it('Должен выбросить ConflictException, если email уже существует', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.update(faker.string.uuid(), mockUpdateUserDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );
    });

    it('Должен выбросить ConflictException, если nickname уже существует', async () => {
      userRepository.findByNickname.mockResolvedValue(mockUser);

      await expect(
        userService.update(faker.string.uuid(), omit(mockUpdateUserDto, ['email'])),
      ).rejects.toThrow(new ConflictException('Nickname already exists'));
    });
  });
});
