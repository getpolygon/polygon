import type { Handler } from "express";

const handler: Handler = async (req, res) => {
  if (!req.cookies["@polygon/refresh"]) return res.sendStatus(403);
  else {
    return res
      .clearCookie("@polygon/refresh", {
        secure: false,
        httpOnly: true,
      })
      .sendStatus(200);
  }
};

export default handler;
