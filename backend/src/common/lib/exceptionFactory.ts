import { BadRequestException, ValidationError } from '@nestjs/common';

export const exceptionFactory = (errors: ValidationError[]): BadRequestException => {
  return new BadRequestException(
    errors.map((error) => ({
      field: error.property,
      errors: error.constraints && Object.values(error.constraints),
    })),
  );
};
