import express from "express";

export default (req: express.Request, res: express.Response) => {
  const { jwt: token } = req.signedCookies;

  if (token) {
    return res
      .status(200)
      .clearCookie("jwt", {
        signed: true,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .json();
  } else return res.status(403).json();
};
