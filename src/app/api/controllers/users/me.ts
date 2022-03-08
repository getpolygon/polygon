import { userDao } from "@container";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

const me: Handler = async (req, res) => {
  const user = await userDao.getUserById(req.user?.id!);
  return new APIResponse(res, { data: user });
};

export default me;
