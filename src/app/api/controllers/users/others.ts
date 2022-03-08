import { userDao } from "@container";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For fetching other accounts
const others: Handler = async (req, res) => {
  const { username } = req.params;
  const user = await userDao.getUserByUsername(username);

  if (user === null) {
    return new APIErrorResponse(res, {
      status: 403,
      data: { message: "User not found" },
    });
  } else {
    return new APIResponse(res, { data: user });
  }
};

export default others;
