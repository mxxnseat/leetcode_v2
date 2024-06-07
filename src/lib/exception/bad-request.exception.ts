import { ErrorObject } from 'ajv';
import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  public readonly code = 'bad_request';
  public readonly status = 400;
  public readonly message = 'Request not valid';
  constructor(public readonly errors: ErrorObject[]) {
    super();
  }
}
