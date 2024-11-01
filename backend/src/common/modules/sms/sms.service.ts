import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ENV, SEND_SMS_URL } from './constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}
  async sendSms(to: string, body: string): Promise<void> {
    await lastValueFrom(
      this.httpService.post(SEND_SMS_URL, {
        number: ENV.SMS_FROM_NUMBER,
        destination: to,
        text: body,
      }),
    );
  }
}
