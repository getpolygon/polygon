const router = require("express").Router();
const FriendController = require("../controllers/api/Friend.API.controller");

router.put("/add", FriendController.addFriend);
router.get("/check", FriendController.checkFriendship);
// TODO: Implement friend request cancelling/accepting

module.exports = router;
