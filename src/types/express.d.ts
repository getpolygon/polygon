import type { User } from "@dao/entities/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: Partial<User>;
  }
}
