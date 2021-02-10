const router = require("express").Router();
const upload = require("../middleware/multer");
const PostController = require("../controllers/api/Post.API.controller");

router.put("/heart", PostController.heartPost);
router.get("/fetch", PostController.getAllPosts);
router.put("/unheart", PostController.unheartPost);
router.delete("/delete", PostController.deletePost);
router.post("/comments/create", PostController.createComment);
router.put("/create", upload.array("attachments"), PostController.createPost);

module.exports = router;
