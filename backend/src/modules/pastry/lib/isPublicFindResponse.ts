import {
  FindPastryByIdServiceResponse,
  PublicFindPastryByIdServiceResponse,
} from '../services/types';

export const isPublicFindResponse = (
  value: NonNullable<FindPastryByIdServiceResponse>,
): value is PublicFindPastryByIdServiceResponse => {
  return 'isLiked' in value;
};
