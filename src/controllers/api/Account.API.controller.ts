import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";
import { checkStatus } from "../../helpers/helpers";
import { RelationStatus, User } from "../../types/index";

// For fetching current account details
export const me = async (req: Express.Request, res: Express.Response) => {
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

// For fetching account details
export const fetch = async (req: Express.Request, res: Express.Response) => {
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
  req: Express.Request,
  res: Express.Response
) => {
  const { id } = req?.user!!;

  try {
    // TODO: Implement
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

// For updating account
export const update = async (req: Express.Request, res: Express.Response) => {};
