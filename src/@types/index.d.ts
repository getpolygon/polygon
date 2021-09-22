import type { User } from "./user";

// Custom declarations
export type Token = {
  id: string;
};

/**
 * Global declarations
 */
declare global {
  namespace Express {
    export interface Request {
      user?: Partial<User>;
      signedCookies?: {
        jwt?: string;
      };
    }

    export interface Response {
      user?: Partial<User>;
    }
  }
}
