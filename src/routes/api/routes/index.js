const router = require("express").Router();

const PostAPI = require("../Post.API");
const NetworkAPI = require("../Network.API");
const AccountAPI = require("../Account.API");
const SearchAPI = require("../Search.API").default;
const FriendAPI = require("../Friend.API").default;
const CommentAPI = require("../Comment.API").default;

router.use("/posts", PostAPI);
router.use("/search", SearchAPI);
router.use("/friends", FriendAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/comments", CommentAPI);

module.exports = router;
