import { relationDao } from "@container";
import validateUUID from "uuid-validate";
import type { Request, Handler } from "express";
import type { Status } from "@dao/entities/Relation";

/**
 * Middleware for checking relation status between 2 users
 *
 * @param paramName - Parameter specified in path. Default: `"id"`
 */
export const verifyNotBlockedWithParams = (paramName = "id"): Handler => {
  return async (req: Request, res, next) => {
    let status: Status;
    // ID or username
    const other = req.params[paramName];

    // Validating with user IDs if other parameter is a valid UUID
    if (validateUUID(other)) {
      const currentId = req.user?.id!;
      status = await relationDao.getRelationByUserIds(currentId, other);
    }
    // If not, validating the status with username
    else {
      const currentUsername = req.user?.username!;
      status = await relationDao.getRelationByUsernames(currentUsername, other);
    }

    if (status === "BLOCKED") return res.sendStatus(403);
    else return next(null);
  };
};
