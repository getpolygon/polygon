import { logger } from "@container";
import { createJwt, verifyJwt } from "@lib/jwt";
import type { Handler, Request } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

const handler: Handler = async (req: Request, res) => {
  const refreshToken = req.cookies["@polygon/refresh"];

  if (!refreshToken) return res.sendStatus(401);
  else {
    try {
      const { id } = verifyJwt<{ id: string }>(refreshToken);
      const access_token = createJwt({ id }, { expiresIn: "2d" });
      const refresh_token = createJwt({ id }, { expiresIn: "30d" });

      return res
        .cookie("@polygon/refresh", refresh_token, {
          secure: false,
          httpOnly: true,
          // 30 days
          maxAge: 1000 * 60 ** 2 * 24 * 30,
        })
        .json({ access_token });
    } catch (error) {
      if (error instanceof JsonWebTokenError) return res.sendStatus(401);
      else {
        logger.error(error);
        return res.sendStatus(500);
      }
    }
  }
};

export default handler;
