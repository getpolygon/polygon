const router = require("express").Router();

const PostAPI = require("../api/Post.API");
const SearchAPI = require("../api/Search.API");
const FriendAPI = require("../api/Friend.API");
const AccountAPI = require("../api/Account.API");
const NotificationAPI = require("../api/Notifications.API");

router.use("/posts", PostAPI);
router.use("/friends", FriendAPI);
router.use("/search", SearchAPI);
router.use("/accounts", AccountAPI);
router.use("/notifications", NotificationAPI);

module.exports = router;
