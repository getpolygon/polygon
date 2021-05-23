const router = require("express").Router();
const FriendController = require("../../controllers/api/Friend.API.controller");

// For adding a friend
router.post("/add", FriendController.addFriend);
// For checking if is a friend
router.get("/check", FriendController.checkFriendship);

module.exports = router;
