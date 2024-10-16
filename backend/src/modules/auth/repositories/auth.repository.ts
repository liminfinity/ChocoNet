import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type { LoginRepositoryResponse } from './types';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<LoginRepositoryResponse | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
      include: {
        avatars: true,
        geolocation: true,
      },
    });
  }

  async findById(userId: string): Promise<LoginRepositoryResponse | null> {
    return this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        avatars: true,
        geolocation: true,
      },
    });
  }
}
