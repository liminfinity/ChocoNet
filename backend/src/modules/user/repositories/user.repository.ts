import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
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

  async findById(userId: string): Promise<User | null> {
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
