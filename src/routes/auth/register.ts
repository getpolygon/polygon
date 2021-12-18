import config from "config";
import express from "express";
import { isEqual } from "lodash";
import { verify, register } from "controllers/auth";
import { celebrate, Joi, Segments } from "celebrate";

const router = express.Router();

// Main registration endpoint
// prettier-ignore
router.post("/", celebrate({
    [Segments.BODY]: {
      lastName: Joi.string().exist(),
      firstName: Joi.string().exist(),
      email: Joi.string().email().exist(),
      password: Joi.string().min(8).exist(),
      username: Joi.string().alphanum().exist(),
    },
  }),
  register
);

// Only enabling the verification route if it is specified in the configuration
if (isEqual(config.polygon?.emailEnableVerification, true)) {
  // prettier-ignore
  router.post("/verify/:token", celebrate({ [Segments.BODY]: { password: Joi.string().min(8).exist() }}), verify);
}

export default router;
