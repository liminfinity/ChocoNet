import { applyDecorators } from '@nestjs/common';
import { IsStrongPassword, ValidationOptions } from 'class-validator';

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
