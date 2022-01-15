import config from "@config";
import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { normalizeEmail } from "@middleware/normalizeEmail";
import { login, register, verify } from "@api/controllers/auth";

const router = express.Router();

router.post(
  "/login",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().exist().cache(),
      password: Joi.string().alphanum().min(8).exist().cache(),
    },
  }),
  normalizeEmail(["email"]),
  login
);

// Main registration endpoint
router.post(
  "/register",
  celebrate({
    [Segments.BODY]: {
      lastName: Joi.string().exist(),
      firstName: Joi.string().exist(),
      email: Joi.string().email().exist(),
      username: Joi.string().alphanum().exist(),
      password: Joi.string().alphanum().min(8).exist(),
    },
  }),
  normalizeEmail(["email"]),
  register
);

// Only enabling the verification route if it is specified in the configuration.
if (config.email.enableVerification) {
  // Verification endpoint. This is used to verify the email address of a temporary user.
  router.post(
    "/verify/:token",
    celebrate({ [Segments.BODY]: { password: Joi.string().min(8).exist() } }),
    verify
  );
}

export default router;
