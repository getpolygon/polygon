import express from "express";
import {
  me,
  fetch,
  update,
  deleteAccount,
} from "../../controllers/Account.API.controller";

const router = express.Router();

// For fetching current account details
router.get("/me", me);
// For fetching account details
router.get("/:username", fetch);
// For updating account
router.patch("/update", update);
// For deleting account
router.delete("/delete", deleteAccount);

export default router;
