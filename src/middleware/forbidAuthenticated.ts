import { Request, Response, NextFunction } from "express";
import { isNil } from "lodash";

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isNil(req.user)) return next(null);
    return res.sendStatus(403);
  };
};
