import Express from "express";
import { body, validationResult } from "express-validator";

// Validators for registration
export const registrationValidationRules = () => {
  return [
    body("password").isLength({ min: 8 }),
    body("email").normalizeEmail().isEmail(),
    body("lastName").trim().escape().notEmpty(),
    body("firstName").trim().escape().notEmpty(),
  ];
};

// Rules for registration->verification
export const verificationValidationRules = () => {
  return [body("password").isLength({ min: 8 })];
};

// Validators for login
export const loginValidationRules = () => {
  return [
    body("password").isLength({ min: 8 }),
    body("email").normalizeEmail().isEmail(),
  ];
};

// Middleware for validating requests
export const validate = () => {
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
