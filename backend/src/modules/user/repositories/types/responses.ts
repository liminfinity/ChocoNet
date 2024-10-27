import { UserDto } from '../../types';

type BaseFindUserRepositoryResponse = UserDto | null;

export type FindUserByIdRepositoryResponse = BaseFindUserRepositoryResponse;

export type FindUserByEmailRepositoryResponse = BaseFindUserRepositoryResponse;
