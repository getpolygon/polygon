import jwt from "jsonwebtoken";
import { isNil } from "lodash";
import config from "config/index";
import type { SignOptions } from "jsonwebtoken";
import { PartialConfigError } from "lib/PartialConfigError";

// Configuration validation
const jwtSecret = process.env.JWT_SECRET || config.jwt?.secret;
const jwtRefresh = process.env.JWT_REFRESH || config.jwt?.refresh;

// If the configuration is not complete, throw an error.
if (isNil(jwtSecret)) throw new PartialConfigError("`jwt.secret`");
else if (isNil(jwtRefresh)) throw new PartialConfigError("`jwt.refresh`");

/**
 * Utility for creating JWTs.
 *
 * @param options - JWT options
 * @param payload - Payload to sign
 */
export const createJwt = (payload: object, options?: SignOptions): string => {
  return jwt.sign(payload, jwtSecret, options);
};

/**
 * Utility for verifying JWTs. This will throw an error if the JWT is invalid.
 *
 * @param token - JWT to verify
 */
export const verifyJwt = <T>(token: string): T => {
  return jwt.verify(token, jwtSecret) as T;
};
