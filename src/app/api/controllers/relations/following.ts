import { APIResponse } from "@app/api/common/APIResponse";
import pg from "@db/pg";
import type { Handler } from "express";

// For getting the people whom the account follows
const following: Handler = async (req, res) => {
  const result = await pg.query(
    `
    SELECT 
      f.*

    FROM relations r

    LEFT OUTER JOIN (
      SELECT
        id,
        username,
        last_name,
        first_name,
        created_at

      FROM users
    ) f ON r.to_user = f.id

    WHERE r.from_user = $1 AND r.status = 'FOLLOWING';
    `,
    [req.params.id]
  );

  return new APIResponse(res, { data: result.rows });
};

export default following;
