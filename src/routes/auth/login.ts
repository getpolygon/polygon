import express from "express";
import { body } from "express-validator";
import { login } from "controllers/auth";
import validate from "validation/middleware";

const router = express.Router();

const loginRules = [
  body("password").isLength({ min: 8 }),
  body("email").normalizeEmail().toLowerCase().isEmail(),
];
// Main login endpoint
router.post("/", loginRules, validate(), login);

export default router;
