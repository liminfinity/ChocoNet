import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { FindPastryMediaByIdsResponse } from '../types';

@Injectable()
export class PastryMediaRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByIds(ids: string[]): Promise<FindPastryMediaByIdsResponse> {
    return this.databaseService.pastryMedia.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        filename: true,
      },
    });
  }
}
