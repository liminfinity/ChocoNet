import { Module } from '@nestjs/common';
import { GeolocationService } from './services';
import { HttpModule } from '@nestjs/axios';
import { BASE_API_URL, ENV } from './constants';

@Module({
  imports: [
    HttpModule.register({
      baseURL: BASE_API_URL,
      params: {
        key: ENV.GEOLOCATION_API_KEY,
        language: 'ru',
        pretty: 1,
        address_only: 1,
      },
    }),
  ],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
