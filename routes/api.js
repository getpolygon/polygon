const router = require("express").Router();

const checkEmailRoute = require("../api/checkEmail");
const createPostRoute = require("../api/createPost");
const fetchPostsRoute = require("../api/fetchPosts");
const deletePostRoute = require("../api/deletePost");
const deleteAccountRoute = require("../api/deleteAccount");
const updateAccountRoute = require("../api/updateAccount");
const checkAccountRoute = require("../api//checkAccount");

router.get("/", (_req, res) => res.send("API Endpoint"));

router.use("/checkEmail", checkEmailRoute);
router.use("/createPost", createPostRoute);
router.use("/fetchPosts", fetchPostsRoute);
router.use("/deletePost", deletePostRoute);
router.use("/checkAccount", checkAccountRoute);
router.use("/deleteAccount", deleteAccountRoute);
router.use("/updateAccount", updateAccountRoute);

module.exports = router;
