import pg from "@db/pg";
import { Handler } from "express";
import { DatabaseError } from "pg";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

const follow: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user?.id) {
      return new APIErrorResponse(res, {
        status: 406,
        data: { error: "Forbidden operation" },
      });
    } else {
      await pg.query(
        `
        INSERT INTO relations (status, to_user, from_user) 
        VALUES ('FOLLOWING', $1, $2);
        `,
        [id, req.user?.id]
      );

      return new APIResponse(res, { data: null });
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.code === "23505") {
        return new APIErrorResponse(res, {
          status: 409,
          data: { error: "Relation already exists" },
        });
      } else if (error.code === "23503") {
        return new APIErrorResponse(res, {
          status: 409,
          data: { error: "Recipient does not exist" },
        });
      } else return next(error);
    } else return next(error);
  }
};

export default follow;
