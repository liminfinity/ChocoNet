import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PastryLikeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(pastryId: string, userId: string): Promise<void> {
    await this.databaseService.pastryLike.create({
      data: {
        pastryId,
        userId,
      },
    });
  }

  async delete(pastryId: string, userId: string): Promise<void> {
    await this.databaseService.pastryLike.delete({
      where: {
        pastryId_userId: {
          pastryId,
          userId,
        },
      },
    });
  }

  async isLiked(pastryId: string, userId: string): Promise<boolean> {
    const like = await this.databaseService.pastryLike.findUnique({
      where: {
        pastryId_userId: {
          pastryId,
          userId,
        },
      },
    });

    return !!like;
  }
}
