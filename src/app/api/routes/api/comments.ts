import express from "express";
import { uuidValidator } from "middleware/uuidValidator";
import { create, ofPost, remove, update } from "api/controllers/comments";

const router = express.Router();

// Get comments of a post
router.get("/:post", uuidValidator(["post"]), ofPost);

// Create a comment
router.post("/:post/create", uuidValidator(["post"]), create);

// Update a comment
router.put(
  "/:post/:comment/update",
  uuidValidator(["post", "comment"]),
  update
);

// Delete a comment
router.delete(
  "/:post/:comment/remove",
  uuidValidator(["post", "comment"]),
  remove
);

export default router;
