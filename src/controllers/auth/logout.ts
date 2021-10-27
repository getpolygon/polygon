import express from "express";

const logout = (req: express.Request, res: express.Response) => {
  if (req.user) {
    return res
      .clearCookie("jwt", {
        signed: true,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .sendStatus(204);
  }

  // If the user is not signed in
  return res.sendStatus(403);
};

export default logout;
