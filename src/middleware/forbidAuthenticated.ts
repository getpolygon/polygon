import { isNil } from "lodash";
import { Request, Response, NextFunction } from "express";

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isNil(req.user)) return next(null);
    return res.sendStatus(403);
  };
};
