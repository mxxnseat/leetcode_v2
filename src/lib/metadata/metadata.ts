export class Metadata {
  private _user: string | null = null;

  public get user() {
    return this._user;
  }
  public setUser(user: string): Metadata {
    this._user = user;
    return this;
  }
}
