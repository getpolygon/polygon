import { User } from "dao/entities/User";
import { Session } from "express-session";

declare module "express" {
  interface Request {
    user?: Partial<User>;
    session: IExtendedSession;
  }
}

interface IExtendedSession extends Session {
  token?: string | null;
  user?: Partial<User> | null;
}
