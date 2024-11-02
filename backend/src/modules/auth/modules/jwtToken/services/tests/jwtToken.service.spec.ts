import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JwtTokenService } from '../jwtToken.service';
import { JwtTokenRepository } from '../../repositories';
import { mockPayload, mockRefreshTokenRequest, mockUpdateRefreshTokenRequest } from './mocks';

describe('Сервис работы с refresh токенами', () => {
  let jwtTokenService: JwtTokenService;
  let jwtTokenRepository: DeepMocked<JwtTokenRepository>;
  let jwtService: DeepMocked<JwtService>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [JwtTokenService],
    })
      .useMocker(createMock)
      .compile();

    jwtTokenService = moduleFixtures.get(JwtTokenService);
    jwtTokenRepository = moduleFixtures.get(JwtTokenRepository);
    jwtService = moduleFixtures.get(JwtService);
  });

  it('Сохранение refresh токена', async () => {
    await jwtTokenService.saveRefreshToken(mockRefreshTokenRequest);
    expect(jwtTokenRepository.saveRefreshToken).toHaveBeenCalledWith(mockRefreshTokenRequest);
  });

  it('Удаление refresh токена', async () => {
    await jwtTokenService.deleteRefreshToken(mockRefreshTokenRequest.token);
    expect(jwtTokenRepository.deleteRefreshToken).toHaveBeenCalledWith(
      mockRefreshTokenRequest.token,
    );
  });

  it('Удаление refresh токенов по userId', async () => {
    await jwtTokenService.deleteRefreshTokensByUserId(mockRefreshTokenRequest.userId);
    expect(jwtTokenRepository.deleteRefreshTokensByUserId).toHaveBeenCalledWith(
      mockRefreshTokenRequest.userId,
    );
  });

  it('Обновление refresh токена', async () => {
    await jwtTokenService.updateRefreshToken(mockUpdateRefreshTokenRequest);
    expect(jwtTokenRepository.updateRefreshToken).toHaveBeenCalledWith(
      mockUpdateRefreshTokenRequest,
    );
  });

  it('Генерация refresh токена', async () => {
    await jwtTokenService.generateRefreshToken(mockPayload);
    expect(jwtService.signAsync).toHaveBeenCalled();
  });

  it('Генерация access токена', async () => {
    await jwtTokenService.generateAccessToken(mockPayload);
    expect(jwtService.signAsync).toHaveBeenCalled();
  });

  it('Генерация токенов', async () => {
    const tokens = await jwtTokenService.generateTokens(mockPayload);
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });

  it('Проверка refresh токена', async () => {
    await jwtTokenService.verifyRefreshToken(mockRefreshTokenRequest.token);
    expect(jwtService.verify).toHaveBeenCalledWith(mockRefreshTokenRequest.token);
  });

  it('Удаление просроченных refresh токенов', async () => {
    await jwtTokenService.deleteExpiredRefreshTokens();
    expect(jwtTokenRepository.deleteExpiredRefreshTokens).toHaveBeenCalled();
  });

  it('Удаление просроченных refresh токенов при инициализации', async () => {
    await jwtTokenService.onModuleInit();
    expect(jwtTokenRepository.deleteExpiredRefreshTokens).toHaveBeenCalled();
  });
});
