import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoneVerificationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string): Promise<void> {
    await this.databaseService.phoneVerification.create({
      data: {
        userId,
      },
    });
  }

  async update(userId: string, isVerified: boolean): Promise<void> {
    await this.databaseService.phoneVerification.update({
      where: {
        userId,
      },
      data: {
        isVerified,
      },
    });
  }
}
