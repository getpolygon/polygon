import express from "express";
import { login } from "controllers/auth";
import { celebrate, Joi, Segments } from "celebrate";

const router = express.Router();

// Main login endpoint
// prettier-ignore
router.post("/", celebrate({ [Segments.BODY]: { email: Joi.string().email().exist(), password: Joi.string().min(8).exist() }}), login);

export default router;
