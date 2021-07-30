import Express from "express";
const router = Express.Router();
import validate from "../../validation";
import {
  fetch,
  create,
  remove,
  fetchOne,
} from "../../controllers/api/Post.API.controller";
import { createPostValidationRules } from "../../validation/rules";

// To fetch posts of an account
router.get("/:username", fetch);
// To fetch only one post with ID
router.get("/only/:id", fetchOne);
// To delete a post
router.delete("/:id/delete", remove);
// To create a post
router.post("/create", createPostValidationRules(), validate(), create);

export default router;
