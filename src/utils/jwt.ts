/**
 * Utility for creating and verifying JWTs
 */
import jwt from "jsonwebtoken";

const { JWT_PRIVATE_KEY: jwtPrivateKey } = process.env;

export const createJwt = (payload: object) => {
  return jwt.sign(payload, jwtPrivateKey!!, {
    expiresIn: "7 days",
  });
};

export const verifyJwt = <T>(token: string) => {
  return jwt.verify(token, jwtPrivateKey!!) as T;
};
