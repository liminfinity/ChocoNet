import { Injectable } from '@nestjs/common';
import { PastryMediaRepository } from '../repositories';
import { FindPastryMediaByIdsResponse, FindPastryMediaByPastryIdResponse } from '../types';

@Injectable()
export class PastryMediaService {
  constructor(private readonly pastryMediaRepository: PastryMediaRepository) {}

  async findByIds(ids: string[]): Promise<FindPastryMediaByIdsResponse> {
    return this.pastryMediaRepository.findByIds(ids);
  }

  async findByPastryId(pastryId: string): Promise<FindPastryMediaByPastryIdResponse> {
    return this.pastryMediaRepository.findByPastryId(pastryId);
  }
}
