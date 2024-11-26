import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PastryMediaService } from '../pastryMedia.service';
import { PastryMediaRepository } from '../../repositories';
import { mockMediaIds, mockPastryId, mockRepositoryPastryMedia } from './mocks';
import { FindPastryMediaByIdsResponse } from '../../types';

describe('Сервис медиа кондитерских изделий', () => {
  let pastryMediaService: PastryMediaService;
  let pastryMediaRepository: DeepMocked<PastryMediaRepository>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [PastryMediaService],
    })
      .useMocker(createMock)
      .compile();

    pastryMediaService = moduleFixtures.get(PastryMediaService);
    pastryMediaRepository = moduleFixtures.get(PastryMediaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Поиск медиа по их ID', () => {

    it('Должно вернуться медиа для указанных ID', async () => {

      pastryMediaRepository.findByIds.mockResolvedValue(mockRepositoryPastryMedia);

      const result = await pastryMediaService.findByIds(mockMediaIds);

      expect(result).toEqual(mockRepositoryPastryMedia);
      expect(pastryMediaRepository.findByIds).toHaveBeenCalledWith(mockMediaIds);
      expect(pastryMediaRepository.findByIds).toHaveBeenCalledTimes(1);
    });

    it('Если не переданы ID, должен вернуть пустой массив', async () => {
      pastryMediaRepository.findByIds.mockResolvedValue([]);

      const result = await pastryMediaService.findByIds([]);

      expect(result).toEqual([]);
      expect(pastryMediaRepository.findByIds).toHaveBeenCalledWith([]);
      expect(pastryMediaRepository.findByIds).toHaveBeenCalledTimes(1);
    });
  });

  describe('Найти медиа по ID кондитерского изделия', () => {

    it('Должно вернуться медиа для указанного ID кондитерского изделия', async () => {

      pastryMediaRepository.findByPastryId.mockResolvedValue(mockRepositoryPastryMedia);

      const result = await pastryMediaService.findByPastryId(mockPastryId);

      expect(result).toEqual(mockRepositoryPastryMedia);
      expect(pastryMediaRepository.findByPastryId).toHaveBeenCalledWith(mockPastryId);
      expect(pastryMediaRepository.findByPastryId).toHaveBeenCalledTimes(1);
    });

    it('Если для кондитерского изделия нет медиа, должен вернуть пустой массив', async () => {

      const mockResponse: FindPastryMediaByIdsResponse = []

      pastryMediaRepository.findByPastryId.mockResolvedValue(mockResponse);

      const result = await pastryMediaService.findByPastryId(mockPastryId);

      expect(result).toEqual(mockResponse);
      expect(pastryMediaRepository.findByPastryId).toHaveBeenCalledWith(mockPastryId);
      expect(pastryMediaRepository.findByPastryId).toHaveBeenCalledTimes(1);
    });
  });
});
