import { PastryRepository } from '@/modules/pastry/repositories';
import { GeolocationService } from '@/common/modules';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { mockGeolocation, mockPastryId, mockQuery, mockRepositoryGetPastries, mockRepositoryPastry, mockUserId } from './mocks';
import { PastryLikeService } from '../pastryLike.service';
import { PastryLikeRepository } from '../../repositories';

describe('Сервис лайков для кондитерских изделий', () => {
  let pastryLikeService: PastryLikeService;
  let pastryLikeRepository: DeepMocked<PastryLikeRepository>;
  let pastryRepository: DeepMocked<PastryRepository>;
  let geolocationService: DeepMocked<GeolocationService>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [PastryLikeService],
    })
      .useMocker(createMock)
      .compile();

    pastryLikeService = moduleFixtures.get(PastryLikeService);
    pastryLikeRepository = moduleFixtures.get(PastryLikeRepository);
    pastryRepository = moduleFixtures.get(PastryRepository);
    geolocationService = moduleFixtures.get(GeolocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Добавление лайка', () => {
    it('Должно выброситься исключение NotFoundException, если кондитерское изделие не найдено', async () => {
      pastryRepository.findById.mockResolvedValue(null);
      await expect(
        pastryLikeService.createLike(mockPastryId, mockUserId),
      ).rejects.toThrow(new NotFoundException('Pastry not found'));
    });

    it('Должно выброситься исключение ForbiddenException, если пользователь пытается поставить лайк на собственное изделие', async () => {
      pastryRepository.findById.mockResolvedValue(mockRepositoryPastry);
      await expect(
        pastryLikeService.createLike(mockPastryId, mockRepositoryPastry.user.id),
      ).rejects.toThrow(new ForbiddenException('You cannot like your own pastry'));
    });

    it('Должно выброситься исключение ConflictException, если пользователь уже поставил лайк этому изделию', async () => {
      pastryRepository.findById.mockResolvedValue(mockRepositoryPastry);
      pastryLikeRepository.isLiked.mockResolvedValue(true);
      await expect(
        pastryLikeService.createLike(mockPastryId, mockUserId),
      ).rejects.toThrow(new ConflictException('You have already liked this pastry'));
    });

    it('Успешное создание лайка', async () => {
      pastryRepository.findById.mockResolvedValue(mockRepositoryPastry);
      pastryLikeRepository.isLiked.mockResolvedValue(false);
      pastryLikeRepository.create.mockResolvedValue(undefined);

      await expect(
        pastryLikeService.createLike(mockPastryId, mockUserId),
      ).resolves.not.toThrow();
      expect(pastryLikeRepository.create).toHaveBeenCalledWith(
        mockPastryId,
        mockUserId,
      );
    });
  });

  describe('Удаление лайка', () => {
    it('Должно выброситься исключение NotFoundException, если кондитерское изделие не найдено', async () => {
      pastryRepository.findById.mockResolvedValue(null);
      await expect(
        pastryLikeService.deleteLike(mockPastryId, mockUserId),
      ).rejects.toThrow(new NotFoundException('Pastry not found'));
    });

    it('Должно выброситься исключение ForbiddenException, если пользователь пытается удалить лайк с собственного изделия', async () => {
      pastryRepository.findById.mockResolvedValue(mockRepositoryPastry);
      await expect(
        pastryLikeService.deleteLike(mockPastryId, mockRepositoryPastry.user.id),
      ).rejects.toThrow(new ForbiddenException('You cannot unlike your own pastry'));
    });

    it('Должен выбросить исключение ConflictException, если пользователь не ставил лайк этому изделию', async () => {
      pastryRepository.findById.mockResolvedValue(mockRepositoryPastry);
      pastryLikeRepository.isLiked.mockResolvedValue(false);
      await expect(
        pastryLikeService.deleteLike(mockPastryId, mockUserId),
      ).rejects.toThrow(new ConflictException('You have not liked this pastry'));
    });

    it('Успешное удаление лайка', async () => {
      pastryRepository.findById.mockResolvedValue(mockRepositoryPastry);
      pastryLikeRepository.isLiked.mockResolvedValue(true);
      pastryLikeRepository.delete.mockResolvedValue(undefined);

      await expect(
        pastryLikeService.deleteLike(mockPastryId, mockUserId),
      ).resolves.not.toThrow();
      expect(pastryLikeRepository.delete).toHaveBeenCalledWith(
        mockPastryId,
        mockUserId,
      );
    });
  });

  describe('Получение лайкнутых кондитерских изделий', () => {
    it('Должен вернуться список понравившихся изделий с медиа-путями и геолокацией', async () => {
      pastryLikeRepository.getLikedPastries.mockResolvedValue(mockRepositoryGetPastries);
      geolocationService.getGeolocationByCoords.mockResolvedValue(mockGeolocation);

      const result = await pastryLikeService.getLikedPastries(mockQuery, mockUserId);
      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBeDefined();
    });
  });

  describe('Лайкнуто ли кондитерское изделие пользователем?', () => {
    it('Должно вернуться true, если пользователь поставил лайк кондитерскому изделию', async () => {
      pastryLikeRepository.isLiked.mockResolvedValue(true);
      const result = await pastryLikeService.isLiked(mockPastryId, mockUserId);
      expect(result).toBe(true);
    });

    it('Должно вернуться false, если пользователь не поставил лайк кондитерскому изделию', async () => {
      pastryLikeRepository.isLiked.mockResolvedValue(false);
      const result = await pastryLikeService.isLiked(mockPastryId, mockUserId);
      expect(result).toBe(false);
    });
  });

  describe('Получение количества лайков', () => {
    it('Должно вернуться количество лайков, полученных изделиями пользователя', async () => {
      pastryLikeRepository.getReceivedLikesCount.mockResolvedValue(5);
      const result = await pastryLikeService.getReceivedLikesCount(mockUserId);
      expect(result).toBe(5);
    });
  });
});
