import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ENV, SEND_SMS_URL } from './constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}
  /**
   * Sends an SMS to the given phone number with the given body.
   *
   * @param to The phone number to send the SMS to.
   * @param body The body of the SMS.
   */
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
