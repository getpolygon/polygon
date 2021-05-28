const router = require("express").Router();
const upload = require("../../middleware/multer");
const PostController = require("../../controllers/api/Post.API.controller");

// To save a post
router.put("/save", PostController.savePost);
// To heart a post
router.put("/heart", PostController.heartPost);
// To fetch posts
router.get("/fetch", PostController.getAllPosts);
// To unheart a post
router.put("/unheart", PostController.unheartPost);
// To delete a post
router.delete("/delete", PostController.deletePost);
// To create a comment
// router.post("/comments/create", PostController.createComment);
// To create a post
router.post("/create", upload.array("attachments"), PostController.createPost);

module.exports = router;
