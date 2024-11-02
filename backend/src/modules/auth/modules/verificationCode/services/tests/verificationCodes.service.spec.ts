import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { VerificationCodeRepository } from '../../repositories';
import { VerificationCodeService } from '../verificationCodes.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockDeleteVerificationCode,
  mockEmail,
  mockEmailConfirmation,
  mockVerifyCode,
} from './mocks';
import { VerificationCodeType } from '@prisma/client';

describe('Сервис верификации кодов', () => {
  let verificationCodeService: VerificationCodeService;
  let verificationCodeRepository: DeepMocked<VerificationCodeRepository>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [VerificationCodeService],
    })
      .useMocker(createMock)
      .compile();

    verificationCodeService = app.get(VerificationCodeService);
    verificationCodeRepository = app.get(VerificationCodeRepository);
  });

  it('Успешное сохранение кода', async () => {
    verificationCodeRepository.save.mockResolvedValue();

    await verificationCodeService.save(mockEmailConfirmation);

    expect(verificationCodeRepository.save).toHaveBeenCalledTimes(1);
    expect(verificationCodeRepository.save).toHaveBeenCalledWith(mockEmailConfirmation);
  });

  it('Успешное удаление кода', async () => {
    verificationCodeRepository.delete.mockResolvedValue();

    await verificationCodeService.delete(mockDeleteVerificationCode);

    expect(verificationCodeRepository.delete).toHaveBeenCalledTimes(1);
    expect(verificationCodeRepository.delete).toHaveBeenCalledWith(mockDeleteVerificationCode);
  });

  it('Успешная проверка кода', async () => {
    verificationCodeRepository.verify.mockResolvedValue(true);

    const result = await verificationCodeService.verify(mockVerifyCode);

    expect(result).toEqual(true);
    expect(verificationCodeRepository.verify).toHaveBeenCalledTimes(1);
    expect(verificationCodeRepository.verify).toHaveBeenCalledWith(mockVerifyCode);
  });

  it('Проверка подтверждения почты', async () => {
    verificationCodeRepository.isEmailConfirmed.mockResolvedValue(true);

    const result = await verificationCodeService.isEmailConfirmed(
      mockEmail,
      VerificationCodeType.EMAIL_CONFIRMATION,
    );

    expect(result).toEqual(true);
    expect(verificationCodeRepository.isEmailConfirmed).toHaveBeenCalledTimes(1);
    expect(verificationCodeRepository.isEmailConfirmed).toHaveBeenCalledWith(
      mockEmail,
      VerificationCodeType.EMAIL_CONFIRMATION,
    );
  });

  it('Генерация кода', () => {
    const result = verificationCodeService.generateVerificationCode();

    expect(result).toHaveLength(6);
    expect(result).toEqual(expect.not.stringMatching(/[a-zA-Z]/));
  });

  it('Удаление всех просроченных кодов при загрузке модуля', async () => {
    verificationCodeRepository.deleteExpiredCodes.mockResolvedValue();

    await verificationCodeService.onModuleInit();

    expect(verificationCodeRepository.deleteExpiredCodes).toHaveBeenCalledTimes(1);
  });

  it('Удаление всех просроченных кодов', async () => {
    verificationCodeRepository.deleteExpiredCodes.mockResolvedValue();

    await verificationCodeService.deleteExpiredCodes();

    expect(verificationCodeRepository.deleteExpiredCodes).toHaveBeenCalledTimes(1);
  });

  it('Проверка существования кода', async () => {
    verificationCodeRepository.isCodeRequestAllowed.mockResolvedValue(true);

    const result = await verificationCodeService.isCodeRequestAllowed(
      mockEmail,
      VerificationCodeType.PASSWORD_RESET,
    );

    expect(result).toEqual(true);
    expect(verificationCodeRepository.isCodeRequestAllowed).toHaveBeenCalledTimes(1);
    expect(verificationCodeRepository.isCodeRequestAllowed).toHaveBeenCalledWith(
      mockEmail,
      VerificationCodeType.PASSWORD_RESET,
    );
  });
});
