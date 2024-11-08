import {
  FindPastryByIdServiceResponse,
  PublicFindPastryByIdServiceResponse,
} from '../services/types';

/**
 * Checks if the given FindPastryByIdServiceResponse is a PublicFindPastryByIdServiceResponse.
 * @param value The response to check.
 * @returns True if the response is a PublicFindPastryByIdServiceResponse, false otherwise.
 */
export const isPublicFindResponse = (
  value: FindPastryByIdServiceResponse,
): value is PublicFindPastryByIdServiceResponse => {
  return 'isLiked' in value;
};
