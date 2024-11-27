import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { mockAxiosErrorResponse, mockAxiosSuccessResponse, mockSuccessApiResponse } from './mocks';
import { GeolocationService } from '../geolocation.service';
import pick from 'lodash.pick';

describe('Сервис геолокации', () => {
  let geolocationService: GeolocationService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const moduleFixtures: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService],
    })
      .useMocker(createMock)
      .compile();

    geolocationService = moduleFixtures.get(GeolocationService);
    httpService = moduleFixtures.get(HttpService);
  });

  describe('Получить геолокацию по координатам', () => {
    it('Должен вернуть базовые данные геолокации, когда уровень "basic"', async () => {
      httpService.get.mockReturnValue(of(mockAxiosSuccessResponse));

      const result = await geolocationService.getGeolocationByCoords(40.7128, -74.006, 'basic');

      const expectedComponents = pick(mockSuccessApiResponse.results[0].components, [
        'city',
        'city_district',
      ]);

      expect(result).toEqual({
        ...expectedComponents,
        formatted: Object.values(expectedComponents).join(', '),
      });

      expect(httpService.get).toHaveBeenCalledWith('', { params: { q: '40.7128,-74.006' } });
    });

    it('Должен вернуть детализированные данные геолокации, когда уровень "detailed"', async () => {
      httpService.get.mockReturnValue(of(mockAxiosSuccessResponse));

      const result = await geolocationService.getGeolocationByCoords(40.7128, -74.006, 'detailed');

      const expectedComponents = pick(mockSuccessApiResponse.results[0].components, [
        'road',
        'state',
        'city',
        'city_district',
      ]);

      expect(result).toEqual({
        ...expectedComponents,
        formatted: Object.values(expectedComponents).join(', '),
      });
      expect(httpService.get).toHaveBeenCalledWith('', { params: { q: '40.7128,-74.006' } });
    });

    it('Должен вернуть базовые данные геолокации по умолчанию, если уровень не указан', async () => {
      httpService.get.mockReturnValue(of(mockAxiosSuccessResponse));

      const result = await geolocationService.getGeolocationByCoords(40.7128, -74.006);

      const expectedComponents = pick(mockSuccessApiResponse.results[0].components, [
        'city',
        'city_district',
      ]);

      expect(result).toEqual({
        ...expectedComponents,
        formatted: Object.values(expectedComponents).join(', '),
      });

      expect(httpService.get).toHaveBeenCalledWith('', { params: { q: '40.7128,-74.006' } });
    });

    it('Должен выбросить ошибку, если API возвращает ошибку с кодом', async () => {
      httpService.get.mockReturnValue(of(mockAxiosErrorResponse));

      await expect(geolocationService.getGeolocationByCoords(40.7128, -74.006)).rejects.toThrow(
        'Bad Request',
      );
      expect(httpService.get).toHaveBeenCalledWith('', { params: { q: '40.7128,-74.006' } });
    });
  });
});
