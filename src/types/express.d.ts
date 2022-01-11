import type { User } from "@db/dao/entities/User";

declare module "express" {
  interface Request {
    user?: Partial<User>;
  }
}
