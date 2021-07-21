import express from "express";
import {
  check,
  block,
  follow,
  unblock,
  unfollow,
  followers,
  following,
} from "../../controllers/api/Relation.API.controller";

const router = express.Router();

// For checking the relationship between current account and another account
router.get("/:id", check);
// For blocking an account
router.post("/:id/block", block);
// For following an account
router.post("/:id/follow", follow);
// For unblocking an account
router.post("/:id/unblock", unblock);
// For unfollowing an account
router.post("/:id/unfollow", unfollow);
// For fetching the followers of an account
router.get("/:id/followers", followers);
// For fetching the people that the user follows
router.get("/:id/following", following);

export default router;
