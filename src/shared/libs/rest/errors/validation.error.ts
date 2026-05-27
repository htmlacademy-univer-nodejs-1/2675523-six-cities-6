import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http.error.js';
import {ValidationErrorFieldInterface} from '../../../models/index.js';

export class ValidationError extends HttpError {
  public readonly details: ValidationErrorFieldInterface[] = [];

  constructor(message: string, errors: ValidationErrorFieldInterface[]) {
    super(StatusCodes.BAD_REQUEST, message);
    this.details = errors;
  }
}
