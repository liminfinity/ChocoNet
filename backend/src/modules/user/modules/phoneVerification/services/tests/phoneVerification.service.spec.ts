import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PhoneVerificationService } from '../phoneVerification.service';
import { SmsService } from '@/common/modules';
import { VerificationCodeService } from '@/modules/auth/modules';
import { UserService } from '@/modules/user';
import { NotFoundException } from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';
import { PhoneVerificationRepository } from '../../repositories';
import { mockUser, mockUserId, mockVerificationCode } from './mocks';
import { deletePlusFromPhone } from '@/common/lib';

describe('PhoneVerificationService', () => {
  let phoneVerificationService: PhoneVerificationService;
  let smsService: DeepMocked<SmsService>;
  let verificationCodeService: DeepMocked<VerificationCodeService>;
  let userService: DeepMocked<UserService>;
  let phoneVerificationRepository: DeepMocked<PhoneVerificationRepository>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [PhoneVerificationService],
    })
      .useMocker(createMock)
      .compile();

    phoneVerificationService = moduleFixtures.get(PhoneVerificationService);
    smsService = moduleFixtures.get(SmsService);
    verificationCodeService = moduleFixtures.get(VerificationCodeService);
    userService = moduleFixtures.get(UserService);
    phoneVerificationRepository = moduleFixtures.get(PhoneVerificationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Получить код подтверждения на телефон', () => {
    it('Должно выброситься исключение NotFoundException, если пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(phoneVerificationService.getCode(mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('lолжно успешно сгенерировать и отправить код подтверждения на телефон пользователя', async () => {
      userService.findById.mockResolvedValue(mockUser);
      verificationCodeService.generateVerificationCode.mockReturnValue(mockVerificationCode);
      verificationCodeService.save.mockResolvedValue(undefined);
      smsService.sendSms.mockResolvedValue(undefined);
      phoneVerificationRepository.create.mockResolvedValue(undefined);

      await phoneVerificationService.getCode(mockUserId);

      expect(verificationCodeService.generateVerificationCode).toHaveBeenCalledWith(3);
      expect(verificationCodeService.save).toHaveBeenCalledWith({
        code: mockVerificationCode,
        email: mockUser?.email,
        type: VerificationCodeType.PHONE_CONFIRMATION,
      });
      expect(smsService.sendSms).toHaveBeenCalledWith(
        deletePlusFromPhone(mockUser?.phone ?? ''),
        expect.any(String),
      );
      expect(phoneVerificationRepository.create).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('Проверка кода подтверждения', () => {
    it('Должно выброситься исключение NotFoundException, если пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(
        phoneVerificationService.verifyCode(mockVerificationCode, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('Должно выброситься исключение NotFoundException, если код подтверждения неверен', async () => {
      userService.findById.mockResolvedValue(mockUser);
      verificationCodeService.verify.mockResolvedValue(false);

      await expect(
        phoneVerificationService.verifyCode(mockVerificationCode, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('Успешное подтверждение кода и обновление статуса в репозитории', async () => {
      userService.findById.mockResolvedValue(mockUser);
      verificationCodeService.verify.mockResolvedValue(true);
      verificationCodeService.delete.mockResolvedValue(undefined);
      phoneVerificationRepository.upsert.mockResolvedValue(undefined);

      await phoneVerificationService.verifyCode(mockVerificationCode, mockUserId);

      expect(verificationCodeService.delete).toHaveBeenCalledWith({
        email: mockUser?.email,
        type: VerificationCodeType.PHONE_CONFIRMATION,
      });
      expect(phoneVerificationRepository.upsert).toHaveBeenCalledWith(mockUserId, true);
    });
  });

  describe('Запросить новый код', () => {
    it('Должно выбрасываться исключение NotFoundException, если пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(phoneVerificationService.requestNewCode(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешная генерация нового кода и отправка его на телефон пользователя', async () => {
      userService.findById.mockResolvedValue(mockUser);
      verificationCodeService.generateVerificationCode.mockReturnValue(mockVerificationCode);
      verificationCodeService.update.mockResolvedValue(undefined);
      smsService.sendSms.mockResolvedValue(undefined);

      await phoneVerificationService.requestNewCode(mockUserId);

      expect(verificationCodeService.generateVerificationCode).toHaveBeenCalledWith(3);
      expect(verificationCodeService.update).toHaveBeenCalledWith({
        code: mockVerificationCode,
        email: mockUser?.email,
        type: VerificationCodeType.PHONE_CONFIRMATION,
      });
      expect(smsService.sendSms).toHaveBeenCalledWith(
        deletePlusFromPhone(mockUser?.phone ?? ''),
        expect.any(String),
      );
    });
  });

  describe('Сбросить статус верификации', () => {
    it('Должно выбрасываться исключение NotFoundException, если пользователь не найден', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(phoneVerificationService.resetVerification(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Успешный сброс статуса верификации для пользователя', async () => {
      userService.findById.mockResolvedValue(mockUser);
      phoneVerificationRepository.upsert.mockResolvedValue(undefined);

      await phoneVerificationService.resetVerification(mockUserId);

      expect(phoneVerificationRepository.upsert).toHaveBeenCalledWith(mockUserId, false);
    });
  });
});
