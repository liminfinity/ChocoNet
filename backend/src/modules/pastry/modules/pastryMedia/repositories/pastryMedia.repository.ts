import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { FindPastryMediaByIdsResponse, FindPastryMediaByPastryIdResponse } from '../types';

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

  async findByPastryId(pastryId: string): Promise<FindPastryMediaByPastryIdResponse> {
    return this.databaseService.pastryMedia.findMany({
      where: {
        pastryId,
      },
      select: {
        id: true,
        filename: true,
      },
    });
  }
}
