import { sql } from "slonik";
import Express from "express";
import { User } from "../types";
import slonik from "../db/slonik";
import emailValidator from "deep-email-validator-extended";
import { body, validationResult } from "express-validator";

// Middleware function for express-validator for validating user emails
const validateEmail = async (value: string) => {
  const { valid } = await emailValidator({
    email: value,
    validateMx: true,
    validateTypo: true,
    validateRegex: true,
    validateSMTP: false,
    validateMxTimeout: 500,
    validateDisposable: true,
  });

  // If the email is valid
  if (valid) {
    // Checking for existing users with that email
    const existingUser = await slonik.maybeOne(sql<User>`
      SELECT * FROM users WHERE email = ${value};
    `);

    // If there is no user with that email
    if (!existingUser) return Promise.resolve(valid);
    // If there is a user with that email
    else return Promise.reject("Email is taken");
  }
  // If it's invalid
  else return Promise.reject("Invalid email");
};

// Middleware function for express-validator for validating user usernames
const validateUsername = async (value: string) => {
  // Validating the username by regex
  const validRegex = /^[a-z0-9_\.]+$/.test(value);

  // If the regex isn't valid
  if (!validRegex) return Promise.reject("Invalid username");
  else {
    // Finding another user with the same username if it exists
    const existingUser = await slonik.maybeOne(sql<User>`
      SELECT * FROM users WHERE username = ${value};
    `);

    // If there are no accounts with that username, make the field valid
    if (!existingUser) return Promise.resolve(validRegex);
    else return Promise.reject("Username is taken");
  }
};

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
  return [
    body("body").notEmpty(),
    // .customSanitizer((input, meta) => {}),
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
