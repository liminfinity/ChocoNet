import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserAvatarService } from '../userAvatar.service';
import { UserAvatarRepository } from '../../repositories';
import { mockUserIds, mockUserAvatarsByIds, mockUserAvatarByUserId, mockUserId } from './mocks';

describe('Сервис аватаров пользователей', () => {
  let userAvatarService: UserAvatarService;
  let userAvatarRepository: DeepMocked<UserAvatarRepository>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [UserAvatarService],
    })
      .useMocker(createMock)
      .compile();

    userAvatarService = moduleFixtures.get(UserAvatarService);
    userAvatarRepository = moduleFixtures.get(UserAvatarRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Поиск аватаров по ID', () => {
    it('Должны вернуться аватары для указанных ID', async () => {
      userAvatarRepository.findByIds.mockResolvedValue(mockUserAvatarsByIds);

      const result = await userAvatarService.findByIds(mockUserIds);

      expect(result).toEqual(mockUserAvatarsByIds);
      expect(userAvatarRepository.findByIds).toHaveBeenCalledWith(mockUserIds);
      expect(userAvatarRepository.findByIds).toHaveBeenCalledTimes(1);
    });

    it('Если не переданы ID, должен вернуть пустой массив', async () => {
      userAvatarRepository.findByIds.mockResolvedValue([]);

      const result = await userAvatarService.findByIds([]);

      expect(result).toEqual([]);
      expect(userAvatarRepository.findByIds).toHaveBeenCalledWith([]);
      expect(userAvatarRepository.findByIds).toHaveBeenCalledTimes(1);
    });
  });

  describe('Найти аватар по ID пользователя', () => {
    it('Должен вернуться аватар для указанного ID пользователя', async () => {
      userAvatarRepository.findByUserId.mockResolvedValue(mockUserAvatarByUserId);

      const result = await userAvatarService.findByUserId(mockUserId);

      expect(result).toEqual(mockUserAvatarByUserId);
      expect(userAvatarRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(userAvatarRepository.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('Если аватар для пользователя не найден, должен вернуть пустой массив', async () => {
      userAvatarRepository.findByUserId.mockResolvedValue([]);

      const result = await userAvatarService.findByUserId(mockUserId);

      expect(result).toEqual([]);
      expect(userAvatarRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(userAvatarRepository.findByUserId).toHaveBeenCalledTimes(1);
    });
  });
});
