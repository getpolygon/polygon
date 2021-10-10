import { body } from "express-validator";

// Rules for post creation
export default () => {
  return [body("body").notEmpty().isLength({ max: 700 })];
};
