import express from "express";
import { create, ofPost, remove, update } from "../../controllers/api/comments";

const router = express.Router();

router.get("/:post", ofPost);
router.post("/:post/create", create);
router.patch("/:post/:comment/update", update);
router.delete("/:post/:comment/remove", remove);

export default router;
