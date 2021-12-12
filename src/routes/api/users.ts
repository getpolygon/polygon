import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { me, others, close } from "controllers/api/users";

const router = express.Router();

// For fetching current account details
router.get("/me", me);
// For closing account
router.delete("/close", close);

// For fetching account details
// prettier-ignore
router.get("/:username", celebrate({ [Segments.PARAMS]: { username: Joi.string().exist() }}), others);

export default router;
