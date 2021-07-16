import express from "express";
import {
  getFollowers,
  checkRelationship,
} from "../../controllers/api/Relation.API.controller";

const router = express.Router();

// For fetching the followers of an account
router.get("/:id/followers", getFollowers);
// For checking the relationship between current account and another account
router.get("/:id/check", checkRelationship);

export default router;
