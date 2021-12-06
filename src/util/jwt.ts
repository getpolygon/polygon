/**
 * Utility for creating and verifying JWTs
 */
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const createJwt = (payload: object, options?: SignOptions) => {
  return jwt.sign(payload, secret!!, options);
};

export const verifyJwt = <T>(token: string) => {
  return jwt.verify(token, secret!!) as T;
};
