import express from "express";
const router = express.Router();
import {
  create,
  remove,
  update,
} from "../../controllers/api/Comment.API.controller";

router.post("/:post/create", create);
router.patch("/:post/:comment/update", update);
router.delete("/:post/:comment/remove", remove);

export default router;
