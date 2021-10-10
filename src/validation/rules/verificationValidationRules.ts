import { body } from "express-validator";

// Rules for registration->verification
export default () => {
  return [body("password").isLength({ min: 8 })];
};
