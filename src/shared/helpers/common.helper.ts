import {ClassConstructor, plainToInstance} from 'class-transformer';
import {ApplicationError} from '../libs/rest/index.js';
import {Error} from 'mongoose';
import {ValidationError} from 'class-validator';
import {ValidationErrorFieldInterface} from '../models/index.js';

export function generateRandomValue(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: readonly T[], count?: number): T[] {
  if (count) {
    const safeCount = Math.min(count, items.length);
    const startPosition = generateRandomValue(0, items.length - safeCount);
    return items.slice(startPosition, startPosition + safeCount);
  }

  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: readonly T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDTO<T, V>(dto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(dto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: ValidationErrorFieldInterface[] = []
) {
  return { errorType, error, details };
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorFieldInterface[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(protocol: 'http' | 'https', host: string, port: number): string {
  return `${protocol}://${host}:${port}`;
}

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Environment variable ${name} is required and cannot be empty`);
  }

  return value;
}
