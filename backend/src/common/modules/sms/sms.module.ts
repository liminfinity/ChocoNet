import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { HttpModule } from '@nestjs/axios';
import { BASE_API_URL, ENV } from './constants';

@Module({
  imports: [
    HttpModule.register({
      baseURL: BASE_API_URL,
      headers: {
        Authorization: `Bearer ${ENV.SMS_API_KEY}`,
      },
    }),
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
