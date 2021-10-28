import express from "express";
import { create, ofPost, remove, update } from "../../controllers/api/comments";

const router = express.Router();

// Get comments of a post
router.get("/:post", ofPost);
// Create a comment
router.post("/:post/create", create);
// Update a comment
router.put("/:post/:comment/update", update);
// Delete a comment
router.delete("/:post/:comment/remove", remove);

export default router;
