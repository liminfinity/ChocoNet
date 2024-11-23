import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * A decorator that validates if a property matches another property in the same object.
 *
 * @param property - The key of the property to match against.
 * @param validationOptions - Optional validation options to pass to the decorator.
 * @returns A function that registers the MatchConstraint validator on the target property.
 */
export const Match = <T extends object>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) => {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if a property matches another property in the same object.
   *
   * @param value - The value of the property to validate.
   * @param args - The validation arguments.
   * @returns `true` if the value matches the related property, `false` otherwise.
   */
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;

    const relatedValue = (args.object as Record<string, string>)[relatedPropertyName];

    return value === relatedValue;
  }

  /**
   * Returns the default error message when the constraint fails.
   * @param args The validation arguments.
   * @returns The default error message.
   */
  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}
