import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { FindPastryMediaByIdsResponse, FindPastryMediaByPastryIdResponse } from '../types';

@Injectable()
export class PastryMediaRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Retrieves pastry media records by the specified list of IDs.
   *
   * @param ids - The IDs of the pastry media records to retrieve.
   * @returns A promise that resolves to an array of pastry media records that match the given IDs.
   *          The records will only contain the `id` and `filename` fields.
   */
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

  /**
   * Retrieves pastry media records by the specified pastry ID.
   *
   * @param pastryId - The ID of the pastry for which media records are to be found.
   * @returns A promise that resolves to an array of objects containing the ID and filename of each pastry media record.
   */
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
