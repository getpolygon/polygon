import { body } from "express-validator";
import { validateEmail, validateUsername } from "./functions";

// Rules for registration
export const registrationValidationRules = () => {
  return [
    body("password").isLength({ min: 8 }),
    body("lastName").trim().escape().notEmpty(),
    body("firstName").trim().escape().notEmpty(),
    body("email").normalizeEmail().custom(validateEmail),
    body("username").toLowerCase().custom(validateUsername),
  ];
};

// Rules for registration->verification
export const verificationValidationRules = () => {
  return [body("password").isLength({ min: 8 })];
};

// Rules for login
export const loginValidationRules = () => {
  return [
    body("password").isLength({ min: 8 }),
    body("email").normalizeEmail().isEmail(),
  ];
};

// Rules for post creation
export const createPostValidationRules = () => {
  return [body("body").notEmpty().isLength({ max: 700 })];
};
