export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExirationDate || this.tokenExirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExirationDate.getTime() - new Date().getTime();
  }
}
