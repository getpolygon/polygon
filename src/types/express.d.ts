import type { User } from "./user";

declare module "express" {
  interface Request {
    user?: Partial<User>;
    signedCookies: {
      jwt?: string;
    };
  }

  interface Response {
    user?: Partial<User>;
  }
}
