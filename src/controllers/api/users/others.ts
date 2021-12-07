import { isNil } from "lodash";
import getFirst from "util/sql/getFirst";
import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";

// For fetching other accounts
const others = async (req: Request, res: Response) => {
  // Getting the username
  const { username } = req.params;

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
  
          FROM users
          WHERE username = $1;
      `,
      [username]
    );

    // If the user doesn't exist
    if (isNil(user)) return res.sendStatus(404);

    // Checking if that user has blocked current user
    const status = await checkStatus({
      other: user?.id!!,
      current: (req?.user as any)?.id!!,
    });

    // If the other user has blocked current user don't send a response
    if (status === "BLOCKED") return res.sendStatus(403);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default others;
