const router = require("express").Router();
const upload = require("../middleware/multer");
const PostController = require("../controllers/api/Post.API.controller");

router.get("/fetch", PostController.getAllPosts);
router.delete("/delete", PostController.deletePost);
router.put("/create", upload.array("attachments"), PostController.createPost);

module.exports = router;
