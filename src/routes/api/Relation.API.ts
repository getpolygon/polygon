import express from "express";
import {
  check,
  follow,
  followers,
} from "../../controllers/api/Relation.API.controller";

const router = express.Router();

// For checking the relationship between current account and another account
router.get("/:id", check);
// For following an account
router.post("/:id/follow", follow);
// For fetching the followers of an account
router.get("/:id/followers", followers);

export default router;
