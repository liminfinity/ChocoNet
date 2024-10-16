import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import type { LoginReposityResponse } from './types';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<LoginReposityResponse | null> {
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
}
