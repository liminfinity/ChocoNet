import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoneVerificationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a new phone verification entry for the given user ID.
   *
   * @param userId - The ID of the user for whom the phone verification entry is to be created.
   * @returns A promise that resolves when the phone verification entry has been successfully created.
   */
  async create(userId: string): Promise<void> {
    await this.databaseService.phoneVerification.create({
      data: {
        userId,
      },
    });
  }

  /**
   * Updates the phone verification status for the given user ID.
   *
   * @param userId - The ID of the user whose phone verification status is to be updated.
   * @param isVerified - A boolean indicating whether the user's phone number has been verified.
   * @returns A promise that resolves when the phone verification status has been successfully updated.
   */
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
