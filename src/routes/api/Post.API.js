const router = require("express").Router();
const upload = require("../../middleware/multer").default;
const PostController =
  require("../../controllers/api/Post.API.controller").default;

// To fetch posts
router.get("/fetch", PostController.fetch);

// To save a post
router.put("/:id/save", PostController.save);
// To unsave a post
router.put("/:id/unsave", PostController.unsave);

// To heart a post
router.put("/:id/heart", PostController.heart);
// To unheart a post
router.put("/:id/unheart", PostController.unheart);

// To update a post
router.patch("/:id/update", PostController.update);
// To delete a post
router.delete("/:id/delete", PostController.delete);
// To create a post
router.post("/create", upload.array("attachments"), PostController.create);

module.exports = router;
