import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isCoordinates', async: false })
export class IsCoordinatesConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const { latitude, longitude } = value as {
      latitude: unknown;
      longitude: unknown;
    };

    return (
      typeof latitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      typeof longitude === 'number' &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  defaultMessage(): string {
    return 'Coordinates must contain valid latitude (-90..90) and longitude (-180..180)';
  }
}

export function IsCoordinates(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCoordinates',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCoordinatesConstraint,
    });
  };
}
