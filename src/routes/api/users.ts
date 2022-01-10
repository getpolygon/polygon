import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { me, others, close } from "controllers/api/users";
import { verifyNotBlockedWithParams } from "middleware/verifyNotBlockedWithParams";

const router = express.Router();

// For fetching current account details
router.get("/me", me);

// For closing account
router.delete("/close", close);

// For fetching account details
router.get(
  "/:username",
  celebrate({ [Segments.PARAMS]: { username: Joi.string().exist() } }),
  verifyNotBlockedWithParams("username"),
  others
);

export default router;
