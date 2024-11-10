import { Injectable } from '@nestjs/common';
import { PastryMediaRepository } from '../repositories';
import { FindPastryMediaByIdsResponse, FindPastryMediaByPastryIdResponse } from '../types';

@Injectable()
export class PastryMediaService {
  constructor(private readonly pastryMediaRepository: PastryMediaRepository) {}

  /**
   * Finds pastry media by their IDs.
   *
   * @param ids - An array of pastry media IDs to find.
   * @returns A promise that resolves to the response containing the pastry media details for the given IDs.
   */
  async findByIds(ids: string[]): Promise<FindPastryMediaByIdsResponse> {
    return this.pastryMediaRepository.findByIds(ids);
  }

  /**
   * Finds pastry media by the ID of the pastry they belong to.
   *
   * @param pastryId - The ID of the pastry to find media for.
   * @returns A promise that resolves to the response containing the pastry media details for the given pastry ID.
   */
  async findByPastryId(pastryId: string): Promise<FindPastryMediaByPastryIdResponse> {
    return this.pastryMediaRepository.findByPastryId(pastryId);
  }
}
