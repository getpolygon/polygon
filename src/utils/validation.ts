import Express from "express";
import validateEmail from "deep-email-validator-extended";
import { body, validationResult } from "express-validator";

// Validators for registration
export const registrationValidationRules = () => {
  return [
    body("password").isLength({ min: 8 }),
    body("lastName").trim().escape().notEmpty(),
    body("firstName").trim().escape().notEmpty(),
    body("username")
      .toLowerCase()
      .custom((value) => /^[a-z0-9_\.]+$/.test(value)),
    body("email")
      .normalizeEmail()
      .custom(async (value) => {
        const { valid, reason } = await validateEmail({
          email: value,
          validateMx: true,
          validateTypo: true,
          validateRegex: true,
          validateSMTP: false,
          validateMxTimeout: 2000,
          validateDisposable: true,
        });

        if (valid) return Promise.resolve(valid);
        else return Promise.reject(reason?.toUpperCase());
      }),
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
    body("email")
      .normalizeEmail()
      .custom(async (value) => {
        const { valid, reason } = await validateEmail({
          email: value,
          validateMx: true,
          validateTypo: true,
          validateRegex: true,
          validateSMTP: false,
          validateMxTimeout: 2000,
          validateDisposable: true,
        });
        if (valid) return Promise.resolve(valid);
        else return Promise.reject(reason?.toUpperCase());
      }),
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
