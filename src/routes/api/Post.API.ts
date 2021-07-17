import Express from "express";
const router = Express.Router();
import upload from "../../middleware/multer";
import {
  fetch,
  create,
  remove,
  fetchOne,
} from "../../controllers/api/Post.API.controller";

// To fetch posts of an account
router.get("/", fetch);

// To fetch one post
router.get("/one/:post", fetchOne);

// // To save a post
// router.put("/:id/save", PostController.save);
// // To unsave a post
// router.put("/:id/unsave", PostController.unsave);

// // To heart a post
// router.put("/:id/heart", PostController.heart);
// // To unheart a post
// router.put("/:id/unheart", PostController.unheart);

// // To update a post
// router.patch("/:id/update", PostController.update);
// To delete a post
router.delete("/:id/delete", remove);
// To create a post
router.post("/create", upload.array("attachments"), create);

export default router;
