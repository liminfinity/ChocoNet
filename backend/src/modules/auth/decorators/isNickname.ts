import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

/**
 * A NestJS decorator that checks whether a string is a valid nickname.
 *
 * The nickname should be between 3 and 20 characters long and contain only letters, numbers, and underscores.
 *
 * @returns A NestJS decorator that checks whether a string is a valid nickname.
 */
export const IsNickname = (): PropertyDecorator => {
  return applyDecorators(
    IsString(),
    Matches(/^[a-zA-Z0-9_]{3,20}$/, {
      message:
        'Nickname must contain only letters, numbers, and underscores and be between 3 and 20 characters long',
    }),
  );
};
