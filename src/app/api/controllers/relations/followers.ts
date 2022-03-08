import pg from "@db/pg";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

// For getting the followers of an account
const followers: Handler = async (req, res) => {
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
    ) f ON r.from_user = f.id

    WHERE r.status = 'FOLLOWING' AND r.to_user = $1;
    `,
    [req.params.id]
  );

  return new APIResponse(res, { data: result.rows });
};

export default followers;
