import { BadRequestException, ValidationError } from '@nestjs/common';

/**
 * Transforms a list of ValidationErrors into a BadRequestException.
 *
 * Each ValidationError in the list is transformed into an object with two properties:
 * - field: the name of the property that triggered the validation error
 * - errors: an array of validation error messages
 *
 * The resulting BadRequestException has a response body with the same structure as the
 * input list of ValidationErrors.
 */
export const exceptionFactory = (errors: ValidationError[]): BadRequestException => {
  return new BadRequestException(
    errors.map((error) => ({
      field: error.property,
      errors: error.constraints && Object.values(error.constraints),
    })),
  );
};
