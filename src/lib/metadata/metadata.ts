export class Metadata {
  private _user: string | null = null;
  private _traceId: string;
  public get user() {
    return this._user;
  }
  public get traceId() {
    return this._traceId;
  }
  public setUser(user: string): Metadata {
    this._user = user;
    return this;
  }
  public setTraceId(traceId: string): Metadata {
    this._traceId = traceId;
    return this;
  }
}
