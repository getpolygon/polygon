import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

// Middleware for validating requests
export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    else return res.status(400).json(errors);
  };
};
