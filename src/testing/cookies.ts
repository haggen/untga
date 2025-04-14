/* eslint-disable @typescript-eslint/no-explicit-any */

type Cookie = {
  name: string;
  value: any;
  [key: string]: any;
};

export const cookies = {
  cookies: {} as Record<string, Cookie>,

  set(mixed: string | Cookie, value?: string) {
    if (typeof mixed === "string") {
      this.cookies[mixed] = { name: mixed, value };
    } else {
      this.cookies[mixed.name] = mixed;
    }
  },

  get(name: string): Cookie | undefined {
    return this.cookies[name];
  },

  delete(name: string) {
    delete this.cookies[name];
  },

  clear() {
    this.cookies = {};
  },

  encode() {
    return Object.values(this.cookies)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  },
};
