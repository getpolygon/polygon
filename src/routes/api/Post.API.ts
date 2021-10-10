import express from "express";
import {
  fetch,
  create,
  remove,
  fetchOne,
  heart,
  unheart,
} from "../../controllers/Post.API.controller";
import validate from "../../validation/middleware";
import createPostValidationRules from "../../validation/rules/createPostValidationRules";

const router = express.Router();

// To fetch posts of an account
router.get("/:username", fetch);
// To like a post
router.post("/:id/heart", heart);
// To unheart a post
router.post("/:id/unheart", unheart);
// To fetch only one post with ID
router.get("/only/:id", fetchOne);
// To delete a post
router.delete("/:id/delete", remove);
// To create a post
router.post("/create", createPostValidationRules(), validate(), create);

export default router;
