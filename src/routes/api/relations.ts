import express from "express";
import {
  status,
  block,
  follow,
  unblock,
  unfollow,
  followers,
  following,
} from "controllers/api/relations";
import { uuidValidator } from "middleware/uuidValidator";

const router = express.Router();

// For checking the relationship between current account and another account
router.get("/:id", uuidValidator(), status);
// For blocking an account
router.post("/:id/block", uuidValidator(), block);
// For following an account
router.post("/:id/follow", uuidValidator(), follow);
// For unblocking an account
router.post("/:id/unblock", uuidValidator(), unblock);
// For unfollowing an account
router.post("/:id/unfollow", uuidValidator(), unfollow);
// For fetching the followers of an account
router.get("/:id/followers", uuidValidator(), followers);
// For fetching the people that the user follows
router.get("/:id/following", uuidValidator(), following);

export default router;
