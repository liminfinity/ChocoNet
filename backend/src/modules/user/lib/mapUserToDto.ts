import { UserDto } from '@/modules/user/dto';
import pick from 'lodash.pick';
import { UserWithRelations } from '../types';
import { PartialDeep, SetRequired } from 'type-fest';

/**
 * Maps a UserWithRelations object to a UserDto.
 *
 * @param user The UserWithRelations object to map.
 * @returns A UserDto object with the mapped fields.
 */
export const mapUserToDto = ({
  avatars,
  ...user
}: SetRequired<PartialDeep<UserWithRelations>, 'email' | 'nickname' | 'firstName' | 'lastName'>): UserDto => {
  const userDto = pick(user, ['email', 'nickname', 'firstName', 'lastName']);

  return {
    ...userDto,
    avatar: avatars?.[0] || null,
  };
};
