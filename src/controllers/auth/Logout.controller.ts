import Express from "express";

export default (req: Express.Request, res: Express.Response) => {
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
