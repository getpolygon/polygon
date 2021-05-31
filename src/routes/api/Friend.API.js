const router = require("express").Router();
const FriendController = require("../../controllers/api/Friend.API.controller");

// For sending a friend request
router.post("/request", FriendController.request);
// For accepting a friend request
router.post("/:id/accept", FriendController.accept);
// For declining a friend request
router.post("/:id/decline", FriendController.decline);
// For checking if is a friend
router.get("/:accountId/check", FriendController.check);

module.exports = router;
