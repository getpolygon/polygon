import config from "@config";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const jwtSecret = config.jwt.secret;
const jwtIssuer = config.jwt.issuer;
const jwtAudience = config.jwt.audience;

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
  }) as unknown as T;
};
