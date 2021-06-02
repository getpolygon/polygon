const router = require("express").Router();
const FriendController = require("../../controllers/api/Friend.API.controller");

// For checking if is a friend
router.get("/:accountId/check", FriendController.check);
// For accepting a friend request
router.post("/:requestId/accept", FriendController.accept);
// For declining a friend request
router.post("/:requestId/decline", FriendController.decline);
// For sending a friend request
router.post("/:accountId/request", FriendController.request);

module.exports = router;
