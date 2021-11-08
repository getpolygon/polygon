import { body } from "express-validator";

// Rules for post creation
export default () => {
  return [
    body("title").notEmpty().isLength({ max: 300 }),
    body("body").optional(),
  ];
};
