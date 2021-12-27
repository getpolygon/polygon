import { User } from "dao/entities/User";

declare module "express" {
  interface Request {
    /**
     * The user making the request.
     */
    user?: Partial<User>;
  }
}
