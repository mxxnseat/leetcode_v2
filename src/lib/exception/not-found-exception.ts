import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  public code = 'resource_not_found';
  public message = 'Resource not found';
  public status = 404;
}
