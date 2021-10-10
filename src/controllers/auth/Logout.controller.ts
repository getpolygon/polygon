import express from "express";

export default (req: express.Request, res: express.Response) => {
  const { jwt: token } = req.signedCookies;

  if (token) {
    return res
      .clearCookie("jwt", {
        signed: true,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .json();
  }

  return res.status(403).json();
};
