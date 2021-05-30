const router = require("express").Router();
const FriendController = require("../../controllers/api/Friend.API.controller");

// For sending a friend request
router.post("/request", () => {});
// For accepting a friend request
router.post("/:id/accept", FriendController.addFriend);
// For declining a friend request
router.post("/:id/decline", () => {});
// For checking if is a friend
router.get("/:accountId/check", FriendController.checkFriendship);

module.exports = router;
