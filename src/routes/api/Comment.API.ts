import express from "express";
import {
  create,
  fetch,
  remove,
  update,
} from "../../controllers/api/Comment.API.controller";

const router = express.Router();

router.get("/:post", fetch);
router.post("/:post/create", create);
router.patch("/:post/:comment/update", update);
router.delete("/:post/:comment/remove", remove);

export default router;
