export type User = any;

declare module "express" {
  interface Request {
    user?: Partial<User>;
  }

  interface Response {
    user?: Partial<User>;
  }
}
