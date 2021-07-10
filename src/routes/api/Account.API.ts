import Express from "express";
const router = Express.Router();

import {
  updateAccount,
  deleteAccount,
  fetchAccount,
} from "../../controllers/api/Account.API.controller";

// For fetching account details
router.get("/fetch", fetchAccount);
// For updating account
router.patch("/update", updateAccount);
// For deleting account
router.delete("/delete", deleteAccount);

export default router;
