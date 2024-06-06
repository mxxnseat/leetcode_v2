import { BaseException } from '@lib/exception';

export class NotAuthorizedException extends BaseException {
  public readonly status = 401;
  public readonly code = 'not_authorized';
  public readonly message = 'You are not authorized to do this action';
}
