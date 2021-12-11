import express from "express";
import { body } from "express-validator";
import validate from "validation/middleware";
import { one, create, remove, ofUser } from "controllers/api/posts";

const router = express.Router();

// To fetch only one post with ID
router.get("/only/:id", one);
// To fetch posts of an account
router.get("/:username", ofUser);
// To delete a post
router.delete("/:id/delete", remove);

const createPostRules = [
  body("title").notEmpty().isLength({ max: 300 }),
  body("body").optional(),
];
// To create a post
router.post("/create", createPostRules, validate(), create);

export default router;
