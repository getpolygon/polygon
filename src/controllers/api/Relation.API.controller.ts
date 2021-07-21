import Express from "express";
import slonik from "../../db/slonik";
import { Relation, User } from "../../types/index";
import {
  sql,
  InvalidInputError,
  UniqueIntegrityConstraintViolationError,
  ForeignKeyIntegrityConstraintViolationError,
} from "slonik";
import { checkStatus } from "../../helpers/helpers";

// For getting the people whom the account follows
export const following = async (
  req: Express.Request,
  res: Express.Response
) => {
  // The ID of the user
  const { id } = req.params;

  try {
    // Checking the relation between 2 users
    const status = await checkStatus({ other: id, current: req.user?.id!! });

    // If not blocked
    if (status !== "BLOCKED") {
      // Getting the users other user follows
      const { rows: following } = await slonik.query(sql<Partial<User>[]>`
        SELECT UserFollowing.* FROM 
        relations Following

        LEFT OUTER JOIN (
          SELECT
            id,
            cover,
            avatar,
            username,
            last_name,
            first_name

          FROM users
        ) UserFollowing ON Following.to_user = UserFollowing.id

        WHERE Following.from_user = ${id} AND Following.status = 'FOLLOWING';
    `);

      return res.json(following);
    } else return res.status(403).json();
  } catch (error) {
    // Undefined behaviour
    console.error(error);
    return res.status(500).json();
  }
};

// For getting the followers of an account
export const followers = async (
  req: Express.Request,
  res: Express.Response
) => {
  // The ID of the user
  const { id } = req.params;

  try {
    // Checking the status between 2 users
    const status = await checkStatus({ other: id, current: req.user?.id!! });

    // If current user is blocked by the other one
    if (status !== "BLOCKED") {
      const { rows: followers } = await slonik.query(sql`
        SELECT Follower.* FROM relations Relation
  
        LEFT OUTER JOIN (
          SELECT 
              id,
              cover,
              avatar,
              username,
              last_name,
              first_name
  
          FROM users
        ) Follower ON Relation.from_user = Follower.id
  
        WHERE Relation.status = 'FOLLOWING' 
        AND Relation.to_user = ${id!!};
      `);

      return res.json(followers);
    } else return res.status(403).json();
  } catch (error) {
    // If the id of the user is invalid
    if (error instanceof InvalidInputError) return res.status(400).json();
    // Undefined behaviour
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For checking relation status
export const check = async (req: Express.Request, res: Express.Response) => {
  // The ID of other user
  const { id } = req.params;

  try {
    // Finding the relation
    const relation = await slonik.maybeOne(sql<Partial<Relation>>`
      SELECT status FROM relations 
      WHERE to_user IN (${id!!}, ${req.user?.id!!}) 
      AND from_user IN (${id!!}, ${req.user?.id!!});
  `);

    return res.json(relation?.status);
  } catch (error) {
    // If the user id is invalid
    if (error instanceof InvalidInputError) return res.status(400).json();
    // Undefined behaviour
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For following another user
export const follow = async (req: Express.Request, res: Express.Response) => {
  // The ID of other user
  const { id } = req.params;

  try {
    // If the user tries to follow himself
    if (id === req.user?.id) return res.status(406).json();
    else {
      // Checking if the other user has blocked current user
      const status = await checkStatus({
        other: id!!,
        current: req.user?.id!!,
      });

      // Not blocked
      if (status !== "BLOCKED") {
        // Creating the relation
        const response = await slonik.maybeOne(sql<any>`
        INSERT INTO relations (status, to_user, from_user) 
        VALUES ('FOLLOWING', ${id}, ${req.user?.id!!})
        RETURNING status;
      `);

        // Sending the status
        return res.json(response?.status);
      } else return res.status(403).json();
    }
  } catch (error) {
    // When other user doesn't exist
    if (error instanceof ForeignKeyIntegrityConstraintViolationError) {
      return res.status(404).json();
    }
    // When same user tries to follow himself
    else if (error instanceof UniqueIntegrityConstraintViolationError) {
      return res.status(409).json();
    }
    // When user id is invalid
    else if (error instanceof InvalidInputError) {
      return res.status(400).json();
    }
    // Undefined behaviour
    else {
      console.error(error);
      return res.status(500);
    }
  }
};

// For unfollowing a user
export const unfollow = async (req: Express.Request, res: Express.Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    if (id === req?.user?.id!!) return res.status(406).json();
    else {
      // Deleting the relation
      await slonik.query(sql`
        DELETE FROM relations
        WHERE to_user = ${id} 
        AND from_user = ${req?.user?.id!!} 
        AND status = 'FOLLOWING';
      `);

      /**
       * Returning null because the user has unfollowed
       */
      return res.json(null);
    }
  } catch (error) {
    // Invalid user id
    if (error instanceof InvalidInputError) return res.status(400).json();
    // Undefined behaviour
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For blocking users
export const block = async (req: Express.Request, res: Express.Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    // If the user tries to block himself
    if (id === req?.user?.id!!) return res.status(406).json();
    else {
      /**
       * If there's an existing relation between these users
       * set the status of the relation to blocked, if a relation
       * doesn't exist, then create one
       */
      const relation = await slonik.maybeOne(sql<Relation>`
        INSERT INTO relations (from_user, to_user, status)
        VALUES (${id!!}, ${req.user?.id!!}, 'BLOCKED')
        ON CONFLICT (status) DO UPDATE SET status = 'BLOCKED';
      `);

      return res.json(relation?.status);
    }
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For unblocking users
export const unblock = async (req: Express.Request, res: Express.Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    // If the user is trying to unblock himself
    if (id === req?.user?.id) return res.status(406).json();
    else {
      await slonik.query(sql`
        DELETE FROM relations
        WHERE from_user = ${req?.user?.id!!} 
        AND to_user = ${id!!} 
        AND status = 'BLOCKED';
      `);

      return res.status(200).json();
    }
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};
