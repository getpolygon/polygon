import api from "./api";
import express from "express";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

const router = express.Router();

router.use("/api", api);
router.all("*", (_, res) => {
  return new APIErrorResponse(res, {
    status: 404,
    data: { message: "Not found" },
  });
});

export default router;
