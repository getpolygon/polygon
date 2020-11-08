const router = require("express").Router();

const addFriendRoute = require("../api/addFriend");
const checkEmailRoute = require("../api/checkEmail");
const createPostRoute = require("../api/createPost");
const fetchPostsRoute = require("../api/fetchPosts");
const deletePostRoute = require("../api/deletePost");
const deleteAccountRoute = require("../api/deleteAccount");
const updateAccountRoute = require("../api/updateAccount");
const checkAccountRoute = require("../api/checkAccount");
const fetchNotificationsRoute = require("../api/fetchNotifications");

router.get("/", (_req, res) => res.send("API Endpoint"));

router.use("/addFriend", addFriendRoute);
router.use("/checkEmail", checkEmailRoute);
router.use("/createPost", createPostRoute);
router.use("/fetchPosts", fetchPostsRoute);
router.use("/deletePost", deletePostRoute);
router.use("/checkAccount", checkAccountRoute);
router.use("/deleteAccount", deleteAccountRoute);
router.use("/updateAccount", updateAccountRoute);
router.use("/fetchNotifications", fetchNotificationsRoute);

module.exports = router;
