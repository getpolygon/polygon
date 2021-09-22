import express from "express";
import type { User } from "../../@types/user";
import getFirst from "../../utils/db/getFirst";
import { checkStatus } from "../../helpers/helpers";

// For fetching current account details
export const me = async (req: express.Request, res: express.Response) => {
  try {
    // Getting the account
    const user = await getFirst<Partial<User>>(
      `
      SELECT
        id,
        bio,
        cover,
        avatar,
        is_private,
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
    return res.status(500).json();
  }
};

// For fetching other accounts
export const fetch = async (req: express.Request, res: express.Response) => {
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
        private,
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

// For deleting account
export const deleteAccount = async (
  req: express.Request,
  res: express.Response
) => {
  // TODO
};

// For updating account
export const update = async (req: express.Request, res: express.Response) => {
  // TODO
};
