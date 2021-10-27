import express from "express";
import { me, others } from "../../controllers/api/users";

const router = express.Router();

// For fetching current account details
router.get("/me", me);
// For fetching account details
router.get("/:username", others);
// // For updating account
// router.patch("/update", update);
// // For deleting account
// router.delete("/delete", deleteAccount);

export default router;
