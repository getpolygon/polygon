import express from "express";
import getFirst from "../../../util/getFirst";
import type { User } from "../../../types/user";

// For fetching current account details
const me = async (req: express.Request, res: express.Response) => {
  try {
    // Getting the account
    const user = await getFirst<Partial<User>>(
      `
      SELECT
        id,
        bio,
        cover,
        avatar,
        username,
        last_name,
        first_name,
        created_at

      FROM users WHERE id = $1;
    `,
      [req.user?.id]
    );

    // Sending the response
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default me;
