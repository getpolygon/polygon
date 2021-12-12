import { User } from "db/dao/entities/User";

declare module "express" {
  interface Request {
    user?: Partial<User>;
  }

  interface Response {
    user?: Partial<User>;
  }
}
