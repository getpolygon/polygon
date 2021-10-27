import { Request, Response, NextFunction } from "express";

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next();
    return res.sendStatus(403);
  };
};
