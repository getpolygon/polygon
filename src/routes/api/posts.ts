import express from "express";
import validate from "../../validation/middleware";
import { one, create, remove, ofUser } from "../../controllers/api/posts";
import createPostValidationRules from "../../validation/rules/createPostValidationRules";

const router = express.Router();

// To fetch posts of an account
router.get("/:username", ofUser);
// To fetch only one post with ID
router.get("/only/:id", one);
// To delete a post
router.delete("/:id/delete", remove);
// To create a post
router.post("/create", createPostValidationRules(), validate(), create);
// // To like a post
// router.post("/:id/heart", heart);
// // To unheart a post
// router.post("/:id/unheart", unheart);

export default router;
