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
   * Creates a new phone verification entry for the given user ID if it does not
   * exist, or updates the existing phone verification entry if it does exist.
   *
   * @param userId - The ID of the user for whom the phone verification entry is
   * to be created or updated.
   * @param isVerified - The new value for the isVerified field.
   *
   * @returns A promise that resolves when the phone verification entry has been
   * successfully created or updated.
   */
  async upsert(userId: string, isVerified: boolean): Promise<void> {
    await this.databaseService.phoneVerification.upsert({
      where: {
        userId,
      },
      update: {
        isVerified,
      },
      create: {
        userId,
        isVerified,
      },
    });
  }
}
