import getFirst from "../../../util/getFirst";
import type { Request, Response } from "express";

// For fetching current account details
const me = async (req: Request, res: Response) => {
  try {
    // Getting the account
    const user = await getFirst<any>(
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
