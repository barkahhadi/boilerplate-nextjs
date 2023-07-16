import { Cookies } from "react-cookie";

export default class CookieManager {
  private cookies: Cookies;
  private key: string = null;
  private maxAge: number;

  constructor(key: string) {
    if (!key) throw new Error("Cookie key is required.");

    this.cookies = new Cookies();
    this.key = key;
    this.maxAge = 365 * 24 * 60 * 60;
  }

  get value() {
    return this.cookies.get(this.key);
  }

  set(value: any) {
    this.cookies.set(this.key, value, {
      path: "/",
      maxAge: this.maxAge,
    });
  }

  remove() {
    this.cookies.remove(this.key, {
      path: "/",
      maxAge: this.maxAge,
    });
  }
}
