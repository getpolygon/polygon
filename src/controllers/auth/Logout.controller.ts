import Express from "express";

export default (req: Express.Request, res: Express.Response) => {
  const { jwt: token } = req.signedCookies;
  if (token) res.status(200).clearCookie("jwt").send();
  else res.status(403).send();
};
