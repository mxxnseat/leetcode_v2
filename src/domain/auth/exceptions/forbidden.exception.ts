import { BaseException } from '@lib/exception';

export class ForbiddenException extends BaseException {
  public readonly status = 403;
  public readonly code = 'forbidden';
  public readonly message = 'Forbidden action';
}
