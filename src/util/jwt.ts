/**
 * Utility for creating and verifying JWTs
 */
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const { JWT_PRIVATE_KEY: jwtPrivateKey } = process.env;

export const createJwt = (payload: object, options?: SignOptions) => {
  return jwt.sign(payload, jwtPrivateKey!!, options);
};

export const verifyJwt = <T>(token: string) => {
  return jwt.verify(token, jwtPrivateKey!!) as T;
};
