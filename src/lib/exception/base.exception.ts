export abstract class BaseException {
  public abstract readonly status: number;
  public abstract readonly code: string;
  public abstract readonly message: string;
}
