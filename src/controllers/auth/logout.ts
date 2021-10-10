import express from "express";

const logout = (req: express.Request, res: express.Response) => {
  const { jwt: token } = req.signedCookies;

  if (token) {
    return res.status(204).clearCookie("jwt", {
      signed: true,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  }

  return res.status(403).json();
};

export default logout;
