import express from "express";
import { validationResult } from "express-validator";

// Middleware for validating requests
export default () => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();
    else return res.status(400).json(errors);
  };
};
