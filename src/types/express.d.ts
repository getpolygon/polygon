import type { User } from "@dao/entities/User";

declare module "express" {
  interface Request {
    user?: Partial<User>;
  }
}
