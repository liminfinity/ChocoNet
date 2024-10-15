import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/modules';
import type { LoginDto } from '../dto';
import type { LoginReposityResponse } from './types';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async login({ email }: LoginDto): Promise<LoginReposityResponse | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });
  }
}
