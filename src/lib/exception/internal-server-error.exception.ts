import { BaseException } from './base.exception';

export class InternalServerErrorException extends BaseException {
  public readonly status = 500;
  public readonly code = 'internal_server';
  public readonly message = 'Internal server error';
}
