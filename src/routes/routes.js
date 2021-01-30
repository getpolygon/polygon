const router = require("express").Router();

// Authentication Routes
const LoginHandler = require("../auth/Login");
const LogoutHandler = require("../auth/Logout");
const RegistrationHandler = require("../auth/Register");
const VerificationHandler = require("../auth/Verify");

// API Routes
const PostAPI = require("../api/Post.API");
const SearchAPI = require("../api/Search.API");
const FriendAPI = require("../api/Friend.API");
const NetworkAPI = require("../api/Network.API");
const AccountAPI = require("../api/Account.API");
const NotificationAPI = require("../api/Notification.API");

// Authentication
router.use("/auth/login", LoginHandler);
router.use("/auth/logout", LogoutHandler);
router.use("/auth/verify", VerificationHandler);
router.use("/auth/register", RegistrationHandler);

// API
router.use("/api/posts", PostAPI);
router.use("/api/friends", FriendAPI);
router.use("/api/search", SearchAPI);
router.use("/api/network", NetworkAPI);
router.use("/api/accounts", AccountAPI);
router.use("/api/notifications", NotificationAPI);

module.exports = router;
