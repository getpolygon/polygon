const router = require("express").Router();
const PostAPI = require("../Post.API");
const SearchAPI = require("../Search.API");
const FriendAPI = require("../Friend.API");
const NetworkAPI = require("../Network.API");
const AccountAPI = require("../Account.API");
const NotificationAPI = require("../Notification.API");

router.use("/posts", PostAPI);
router.use("/search", SearchAPI);
router.use("/friends", FriendAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/notifications", NotificationAPI);

module.exports = router;
