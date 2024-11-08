import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PastryLikeRepository } from '../repositories';
import { PastryRepository } from '@/modules/pastry/repositories';

@Injectable()
export class PastryLikeService {
  constructor(
    private readonly pastryLikeRepository: PastryLikeRepository,
    private readonly pastryRepository: PastryRepository,
  ) {}

  async createLike(pastryId: string, userId: string): Promise<void> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    if (pastry.user.id === userId) {
      throw new ForbiddenException('You cannot like your own pastry');
    }

    const isLiked = await this.pastryLikeRepository.isLiked(pastryId, userId);

    if (isLiked) {
      throw new ConflictException('You have already liked this pastry');
    }

    await this.pastryLikeRepository.create(pastryId, userId);
  }

  async deleteLike(pastryId: string, userId: string): Promise<void> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    if (pastry.user.id === userId) {
      throw new ForbiddenException('You cannot unlike your own pastry');
    }

    const isLiked = await this.pastryLikeRepository.isLiked(pastryId, userId);

    if (!isLiked) {
      throw new ConflictException('You have not liked this pastry');
    }

    await this.pastryLikeRepository.delete(pastryId, userId);
  }

  async isLiked(pastryId: string, userId: string): Promise<boolean> {
    return this.pastryLikeRepository.isLiked(pastryId, userId);
  }
}
