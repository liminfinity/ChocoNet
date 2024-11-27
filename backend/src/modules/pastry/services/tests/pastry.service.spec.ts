import { Test, TestingModule } from '@nestjs/testing';
import { PastryService } from '../pastry.service';
import { GeolocationService } from '@/common/modules';
import { NotFoundException } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  mockCreatePastryDto,
  mockUpdatePastryDto,
  mockPastry,
  mockUserId,
  mockPastryId,
  mockQuery,
  mockOwnerPastry,
  mockGuestPastry,
  mockAuthorizedPastry,
  mockGetPastries,
  mockGeolocation,
  mockGetSimilarPastries,
  mockGetUserPastries,
} from './mocks';
import { PastryLikeService, PastryMediaService } from '../../modules';
import { PastryRepository } from '../../repositories';
import { faker } from '@faker-js/faker';

describe('Сервис кондитерских изделий', () => {
  let pastryService: PastryService;
  let pastryRepository: DeepMocked<PastryRepository>;
  let pastryLikeService: DeepMocked<PastryLikeService>;
  let pastryMediaService: DeepMocked<PastryMediaService>;
  let geolocationService: DeepMocked<GeolocationService>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [PastryService],
    })
      .useMocker(createMock)
      .compile();

    pastryService = moduleFixtures.get(PastryService);
    pastryRepository = moduleFixtures.get(PastryRepository);
    pastryLikeService = moduleFixtures.get(PastryLikeService);
    pastryMediaService = moduleFixtures.get(PastryMediaService);
    geolocationService = moduleFixtures.get(GeolocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Создание кондитерского изделия', () => {
    it('Успешное создание', async () => {
      pastryRepository.create.mockResolvedValue({ id: mockPastryId });
      const result = await pastryService.create(mockUserId, mockCreatePastryDto);
      expect(result.id).toBe(mockPastryId);
    });
  });

  describe('Поиск кондитерского изделия по ID', () => {
    beforeEach(() => {
      geolocationService.getGeolocationByCoords.mockResolvedValue(mockGeolocation);
    });

    it('Должно выброситься исключение NotFoundException, если кондитерское изделие не найдено', async () => {
      pastryRepository.findById.mockResolvedValue(null);
      await expect(pastryService.findById(mockPastryId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Возвращаемые данные для владельца товара', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      const result = await pastryService.findById(mockPastryId, mockUserId);
      expect(result).toEqual(mockOwnerPastry);
    });
    it('Возвращаемые данные для гостя', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      const result = await pastryService.findById(mockPastryId);
      expect(result).toEqual(mockGuestPastry);
    });
    it('Возвращаемые данные для авторизованного пользователя', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      pastryLikeService.isLiked.mockResolvedValue(mockAuthorizedPastry.isLiked);
      const result = await pastryService.findById(mockPastryId, faker.string.uuid());
      expect(result).toEqual(mockAuthorizedPastry);
    });
  });

  describe('Обновление кондитерского изделия', () => {
    beforeEach(() => {
      pastryMediaService.findByIds.mockResolvedValue([]);
    });

    it('Успешное обновление', async () => {
      pastryRepository.update.mockResolvedValue(undefined);
      await expect(pastryService.update(mockPastryId, mockUpdatePastryDto)).resolves.not.toThrow();
    });
  });

  describe('Удаление кондитерского изделия', () => {
    beforeEach(() => {
      pastryMediaService.findByIds.mockResolvedValue([]);
    });
    it('Успешное удаление кондитерского изделия и связанных медиафайлов', async () => {
      pastryRepository.delete.mockResolvedValue(undefined);

      await expect(pastryService.delete(mockPastryId)).resolves.not.toThrow();
    });
  });

  describe('Кондитерское изделие принадлежит пользователю?', () => {

    beforeEach(() => {
      geolocationService.getGeolocationByCoords.mockResolvedValue(mockGeolocation);
    });

    it('Должно вернуться true, если пользователь является владельцем изделия', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      const result = await pastryService.isPastryOwnedByUser(mockPastryId, mockUserId);
      expect(result).toBe(true);
    });

    it('должен вернуть false, если пользователь не является владельцем изделия', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      const result = await pastryService.isPastryOwnedByUser(mockPastryId, faker.string.uuid());
      expect(result).toBe(false);
    });

    it('должен выбросить исключение NotFoundException, если изделие не найдено', async () => {
      pastryRepository.findById.mockResolvedValue(null);
      await expect(pastryService.isPastryOwnedByUser(mockPastryId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Получение списка кондитерских изделий', () => {

    beforeEach(() => {
      geolocationService.getGeolocationByCoords.mockResolvedValue(mockGeolocation);
    });

    it('Должен вернуться список кондитерских изделий с геолокацией и медиапутями', async () => {
      pastryRepository.getPastries.mockResolvedValue(mockGetPastries);
      const result = await pastryService.getPastries(mockQuery, mockUserId);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('geolocation');
      expect(result.data[0]).toHaveProperty('media');
    });
  });

  describe('Получение похожих кондитерских изделий', () => {
    it('Должен вернуться список похожих изделий на основе категории и имени', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      pastryRepository.getSimilarPastries.mockResolvedValue(mockGetSimilarPastries);
      const result = await pastryService.getSimilarPastries(mockQuery, mockPastryId, mockUserId);
      expect(result.data).toHaveLength(1);
    });

    it('Должна вернуться информация о лайке, если пользователь авторизован', async () => {
      pastryRepository.findById.mockResolvedValue(mockPastry);
      pastryRepository.getSimilarPastries.mockResolvedValue(mockGetSimilarPastries);
      pastryLikeService.isLiked.mockResolvedValue(true);
      pastryService.isPastryOwnedByUser = jest.fn().mockResolvedValue(false);
      const result = await pastryService.getSimilarPastries(mockQuery, mockPastryId, faker.string.uuid());
      expect(result.data[0]).toHaveProperty('isLiked');
    });

    it('Должно выброситься исключение NotFoundException, если изделие не найдено', async () => {
      pastryRepository.findById.mockResolvedValue(null);
      await expect(
        pastryService.getSimilarPastries(mockQuery, mockPastryId, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Получение кондитерских изделий пользователя', () => {

    beforeEach(() => {
      geolocationService.getGeolocationByCoords.mockResolvedValue(mockGeolocation);
    })

    it('Должен вернуться список кондитерских изделий пользователя', async () => {
      pastryRepository.getUserPastries.mockResolvedValue(mockGetUserPastries);
      const result = await pastryService.getUserPastries(mockQuery, mockUserId, mockUserId);
      expect(result.data).toHaveLength(1);
    });

    it('Должна вернуться информация о лайке, если пользователь авторизован', async () => {
      pastryRepository.getUserPastries.mockResolvedValue(mockGetUserPastries);
      pastryLikeService.isLiked.mockResolvedValue(true);
      const result = await pastryService.getUserPastries(mockQuery, mockUserId, faker.string.uuid());
      expect(result.data[0]).toHaveProperty('isLiked', true);
    });
  });
});
