import CookieManager from ".";

class AuthCookie extends CookieManager {
  constructor() {
    super("auth");
  }

  get token() {
    return this.value && this.value.token;
  }

  get refreshToken() {
    return this.value && this.value.refreshToken;
  }

  get user() {
    return this.value && this.value.user;
  }

  get isAuthenticated() {
    return !!this.value && !!this.value.token;
  }
}

export default new AuthCookie();
