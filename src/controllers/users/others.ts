import express from "express";
import getFirst from "../../utils/getFirst";
import type { User } from "../../types/user";
import { checkStatus } from "../../helpers/helpers";

// For fetching other accounts
const others = async (req: express.Request, res: express.Response) => {
  // Getting the username
  const { username } = req.params;

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
          is_private,
          created_at
  
          FROM users
          WHERE username = $1;
      `,
      [username]
    );

    // If the user doesn't exist
    if (!user) return res.status(404).json();
    // Sending the user
    else {
      // Checking if that user has blocked current user
      const status = await checkStatus({
        other: user?.id!!,
        current: req?.user?.id!!,
      });

      // If the other user has blocked current user don't send a response
      if (status === "BLOCKED") return res.status(403).json();
      else return res.json(user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

export default others;
