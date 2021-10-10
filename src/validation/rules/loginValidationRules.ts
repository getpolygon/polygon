import { body } from "express-validator";

export default () => {
  return [
    body("password").isLength({ min: 8 }),
    body("email").normalizeEmail().toLowerCase().isEmail(),
  ];
};
