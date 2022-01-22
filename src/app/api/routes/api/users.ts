import { z } from "zod";
import express from "express";
import { zodiac } from "@middleware/zodiac";
import { me, others, close } from "@api/controllers/users";
import { verifyNotBlockedWithParams } from "@middleware/verifyNotBlockedWithParams";

const router = express.Router();

// For fetching current account details
router.get("/me", me);

// For closing account
router.delete("/close", close);

// For fetching account details
router.get(
  "/:username",
  zodiac({
    params: z.object({
      username: z.string().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
    }),
  }),
  verifyNotBlockedWithParams("username"),
  others
);

export default router;
