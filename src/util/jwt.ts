import jwt from "jsonwebtoken";
import { isNil } from "lodash";
import type { SignOptions } from "jsonwebtoken";
import { PartialConfigError } from "lib/PartialConfigError";

const SECRET = process.env.JWT_SECRET;
if (isNil(SECRET)) throw new PartialConfigError("`jwt.secret`");

/**
 * Utility for creating JWTs
 *
 * @param payload - JWT payload
 * @param options - JWT options
 */
export const createJwt = (payload: object, options?: SignOptions): string => {
  return jwt.sign(payload, SECRET, options);
};

/**
 * Utility for verifying JWTs
 *
 * @param token - JWT string
 */
export const verifyJwt = <T>(token: string): T => {
  return jwt.verify(token, SECRET) as T;
};
