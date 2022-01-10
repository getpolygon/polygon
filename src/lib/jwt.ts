import jwt from "jsonwebtoken";
import config from "config/index";
import type { SignOptions } from "jsonwebtoken";

// Configuration validation
const jwtSecret = config.jwt?.secret;
// const jwtRefresh = config.jwt?.refresh;

// JWT metadata
const jwtIssuer = "@polygon-isecure/core";
const jwtAudience = ["@polygon-isecure/polygon", "@polygon-isecure/next"];

/**
 * Utility for creating JWTs.
 *
 * @param options - JWT options
 * @param payload - Payload to sign
 */
export const createJwt = (payload: object, options?: SignOptions): string => {
  return jwt.sign(payload, jwtSecret, {
    issuer: jwtIssuer,
    audience: jwtAudience,
    ...options,
  });
};

/**
 * Utility for verifying JWTs. This will throw an error if the JWT is invalid.
 *
 * @param token - JWT to verify
 */
export const verifyJwt = <T>(token: string): T => {
  return jwt.verify(token, jwtSecret, {
    issuer: jwtIssuer,
    audience: jwtAudience,
  }) as T;
};
