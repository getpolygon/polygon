import { sql } from "slonik";
import express from "express";
import slonik from "../../db/slonik";
import { User } from "../../@types/index";
import { checkStatus } from "../../helpers/helpers";

// For fetching current account details
export const me = async (req: express.Request, res: express.Response) => {
  try {
    // Getting the account
    const user = await slonik.maybeOne(sql<Partial<User>>`
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

        FROM users WHERE id = ${req.user?.id!!};
    `);

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
    const user = await slonik.maybeOne(sql<Partial<User>>`
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
        WHERE username = ${username!!};
    `);

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
  const { id } = req?.user!!;

  try {
    // TODO
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

// For updating account
export const update = async (req: express.Request, res: express.Response) => {
  const { body } = req;

  for (const field in body) {
    const value = body[field];

    try {
      switch (field) {
        case "firstName": {
          await slonik.query(sql`
            UPDATE users SET first_name = ${value} 
            WHERE id = ${req.user?.id!!}
          `);
          break;
        }
        case "lastName": {
          await slonik.query(sql`
            UPDATE users SET last_name = ${value} 
            WHERE id = ${req.user?.id!!}
          `);
          break;
        }
        default: {
          res.status(304).json();
          break;
        }
      }

      return res.status(204).json();
    } catch (error) {
      console.error({ error });
      return res.status(304).json();
    }
  }
};
