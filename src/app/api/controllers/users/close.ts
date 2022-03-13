import { userDao } from "@container";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

const close: Handler = async (req, res) => {
  await userDao.deleteUserById(req.user?.id!);
  return new APIResponse(res, { data: null, status: 204 });
};

export default close;
