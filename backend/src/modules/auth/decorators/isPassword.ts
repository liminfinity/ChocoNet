import { applyDecorators } from '@nestjs/common';
import { IsStrongPassword, ValidationOptions } from 'class-validator';

/**
 * A NestJS decorator that checks whether a string is a valid password.
 *
 * The password should be at least 8 characters long and contain at least one number and one symbol.
 *
 * @param validateOptions The options to be passed to the underlying `IsStrongPassword` validation decorator.
 * @returns A NestJS decorator that checks whether a string is a valid password.
 */
export const IsPassword = (validateOptions?: ValidationOptions): PropertyDecorator => {
  return applyDecorators(
    IsStrongPassword(
      {
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 0,
        minUppercase: 0,
      },
      {
        message:
          'Password should be at least 8 characters long and contain at least one number and one symbol',
        ...validateOptions,
      },
    ),
  );
};
