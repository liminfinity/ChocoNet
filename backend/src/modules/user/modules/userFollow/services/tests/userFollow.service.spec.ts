import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserFollowService } from '../userFollow.service';
import { UserService } from '@/modules/user/services';
import { ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { UserFollowRepository } from '../../repositories';
import {
  mockFollowerId,
  mockFollowingId,
  mockGetFollows,
  mockGetFollowsDto,
  mockQuery,
  mockUser,
} from './mocks';

describe('Сервис подписок', () => {
  let userFollowService: UserFollowService;
  let userService: DeepMocked<UserService>;
  let userFollowRepository: DeepMocked<UserFollowRepository>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [UserFollowService],
    })
      .useMocker(createMock)
      .compile();

    userFollowService = moduleFixtures.get(UserFollowService);
    userService = moduleFixtures.get(UserService);
    userFollowRepository = moduleFixtures.get(UserFollowRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Подписка', () => {
    it('Должно выбрасываться исключение ForbiddenException, если пользователь пытается подписаться на себя', async () => {
      await expect(userFollowService.follow(mockFollowerId, mockFollowerId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('Должно выбрасываться исключение NotFoundException, если подписываемый пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);
      await expect(userFollowService.follow(mockFollowerId, mockFollowingId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Должно выбрасываться исключение ConflictException, если пользователь уже подписан на другого пользователя', async () => {
      userService.findById.mockResolvedValue(mockUser);
      userFollowRepository.isFollowing.mockResolvedValue(true);
      await expect(userFollowService.follow(mockFollowerId, mockFollowingId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('Успешная подписка пользователя на другого', async () => {
      userService.findById.mockResolvedValue(mockUser);
      userFollowRepository.isFollowing.mockResolvedValue(false);
      userFollowRepository.follow.mockResolvedValue(undefined);

      await userFollowService.follow(mockFollowerId, mockFollowingId);

      expect(userFollowRepository.follow).toHaveBeenCalledWith(mockFollowerId, mockFollowingId);
    });
  });

  describe('Отписка', () => {
    it('Должно выбрасываться исключение ForbiddenException, если пользователь пытается отписаться от себя', async () => {
      await expect(userFollowService.unfollow(mockFollowerId, mockFollowerId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('Должно выбрасываться исключение NotFoundException, если подписываемый пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);
      await expect(userFollowService.unfollow(mockFollowerId, mockFollowingId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Должно выбрасываться исключение ConflictException, если пользователь не подписан на другого', async () => {
      userService.findById.mockResolvedValue(mockUser);
      userFollowRepository.isFollowing.mockResolvedValue(false);
      await expect(userFollowService.unfollow(mockFollowerId, mockFollowingId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('Успешная отписка пользователя от другого', async () => {
      userService.findById.mockResolvedValue(mockUser);
      userFollowRepository.isFollowing.mockResolvedValue(true);
      userFollowRepository.unfollow.mockResolvedValue(undefined);

      await userFollowService.unfollow(mockFollowerId, mockFollowingId);

      expect(userFollowRepository.unfollow).toHaveBeenCalledWith(mockFollowerId, mockFollowingId);
    });
  });

  describe('Отписать от себя', () => {
    it('Должно выбрасываться исключение ForbiddenException, если пользователь пытается отписаться от себя', async () => {
      await expect(
        userFollowService.unfollowFromYou(mockFollowerId, mockFollowerId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('Должно выбрасываться исключение NotFoundException, если пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);
      await expect(
        userFollowService.unfollowFromYou(mockFollowerId, mockFollowingId),
      ).rejects.toThrow(NotFoundException);
    });

    it('Должно выбрасываться исключение ConflictException, если пользователь не подписан на другого', async () => {
      userService.findById.mockResolvedValue(mockUser);
      userFollowRepository.isFollowing.mockResolvedValue(false);
      await expect(
        userFollowService.unfollowFromYou(mockFollowerId, mockFollowingId),
      ).rejects.toThrow(ConflictException);
    });

    it('Успешная отписка другого пользователя от себя', async () => {
      userService.findById.mockResolvedValue(mockUser);
      userFollowRepository.isFollowing.mockResolvedValue(true);
      userFollowRepository.unfollow.mockResolvedValue(undefined);

      await userFollowService.unfollowFromYou(mockFollowerId, mockFollowingId);

      expect(userFollowRepository.unfollow).toHaveBeenCalledWith(mockFollowerId, mockFollowingId);
    });
  });

  describe('Пользователь подписан на другого?', () => {
    it('Должно вернуться true, если пользователь подписан на другого', async () => {
      userFollowRepository.isFollowing.mockResolvedValue(true);

      const result = await userFollowService.isFollowing(mockFollowerId, mockFollowingId);

      expect(result).toBe(true);
    });

    it('Должно вернуться false, если пользователь не подписан на другого', async () => {
      userFollowRepository.isFollowing.mockResolvedValue(false);

      const result = await userFollowService.isFollowing(mockFollowerId, mockFollowingId);

      expect(result).toBe(false);
    });
  });

  describe('Получить список подписок', () => {
    it('Должен вернуться список подписок для пользователя с правильными данными и пагинацией', async () => {
      userFollowRepository.getFollows.mockResolvedValue(mockGetFollows);

      const result = await userFollowService.getFollows(mockQuery, mockFollowerId);

      expect(result).toEqual(mockGetFollowsDto);
      expect(userFollowRepository.getFollows).toHaveBeenCalledWith(mockQuery, mockFollowerId);
    });
  });
});
