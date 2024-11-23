import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PhoneVerificationService } from '@/modules/user/modules';
import { UserService } from '@/modules/user';
import { VerificationCodeService } from '@/modules/auth/modules';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { mockServiceUser } from './mocks';
import { PhoneVerificationRepository } from '../../repositories';

describe('Сервис подтверждения телефона', () => {
  let phoneVerificationService: PhoneVerificationService;
  let userService: DeepMocked<UserService>;
  let verificationCodeService: DeepMocked<VerificationCodeService>;
  let phoneVerificationRepository: DeepMocked<PhoneVerificationRepository>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [PhoneVerificationService],
    })
      .useMocker(createMock)
      .compile();

    phoneVerificationService = moduleFixture.get(PhoneVerificationService);
    userService = moduleFixture.get(UserService);
    verificationCodeService = moduleFixture.get(VerificationCodeService);
    phoneVerificationRepository = moduleFixture.get(PhoneVerificationRepository);
  });

  it('Пользователь не найден - ошибка', async () => {
    userService.findById.mockResolvedValue(null);
    await expect(phoneVerificationService.verifyCode('12345', 'userId')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('Код невалиден - ошибка', async () => {
    userService.findById.mockResolvedValue(mockServiceUser);
    verificationCodeService.verify.mockResolvedValue(false);
    await expect(phoneVerificationService.verifyCode('12345', 'userId')).rejects.toThrow(
      new NotFoundException('Code is not valid'),
    );
  });

  it('Успешная проверка и удаление кода', async () => {
    userService.findById.mockResolvedValue(mockServiceUser);
    verificationCodeService.verify.mockResolvedValue(true);
    verificationCodeService.delete.mockResolvedValue();
    await phoneVerificationService.verifyCode('12345', 'userId');
    expect(verificationCodeService.delete).toHaveBeenCalledTimes(1);
  });

  it('Обновление репозитория проверки телефона после успешной проверки', async () => {
    userService.findById.mockResolvedValue(mockServiceUser);
    verificationCodeService.verify.mockResolvedValue(true);
    phoneVerificationRepository.upsert.mockResolvedValue();
    await phoneVerificationService.verifyCode('12345', 'userId');
    expect(phoneVerificationRepository.upsert).toHaveBeenCalledTimes(1);
  });
});
