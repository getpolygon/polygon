import { body } from "express-validator";
import validateEmail from "../functions/validateEmail";
import validateUsername from "../functions/validateUsername";

export default () => {
  return [
    body("password").isLength({ min: 8 }),
    body("lastName").trim().escape().notEmpty(),
    body("firstName").trim().escape().notEmpty(),
    body("username").toLowerCase().custom(validateUsername),
    body("email").normalizeEmail().toLowerCase().custom(validateEmail),
  ];
};
