import Express from "express";
import { validationResult } from "express-validator";

// Middleware for validating requests
export default () => {
  return (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    else return res.status(400).json(errors);
  };
};
