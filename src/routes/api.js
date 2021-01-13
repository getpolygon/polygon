const router = require("express").Router();

const PostAPI = require("../api/Post.API");
const SearchAPI = require("../api/Search.API");
const FriendAPI = require("../api/Friend.API");
const NetworkAPI = require("../api/Network.API");
const AccountAPI = require("../api/Account.API");
const NotificationAPI = require("../api/Notifications.API");

router.get("/", (_req, res) => {
  res.status(200).json({
    message: "API Endpoint"
  });
});
router.use("/posts", PostAPI);
router.use("/friends", FriendAPI);
router.use("/search", SearchAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/notifications", NotificationAPI);

module.exports = router;
