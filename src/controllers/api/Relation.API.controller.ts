import Express from "express";
import slonik from "../../db/slonik";
import {
  sql,
  UniqueIntegrityConstraintViolationError,
  ForeignKeyIntegrityConstraintViolationError,
} from "slonik";

// For getting the people whom the account follows
export const following = async (
  req: Express.Request,
  res: Express.Response
) => {
  // The ID of the user
  const { id } = req.params;

  try {
    const { rows: following } = await slonik.query(sql`
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
  } catch (error) {
    console.error(error);
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
    const {
      rows: { 0: blocked },
    } = await slonik.query(sql`
      SELECT * FROM relations
      WHERE to_user = ${req.user?.id!!} 
      AND status = 'BLOCKED' AND from_user = ${String(id)};
    `);

    if (!blocked) {
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
        AND Relation.to_user = ${String(id)};
      `);

      return res.json(followers);
    } else return res.status(403).json({ reason: "BLOCKED" });
  } catch (error) {
    // TODO: Handle invalid UUID ID error
  }
};

// For checking relation status
export const check = async (req: Express.Request, res: Express.Response) => {
  // The ID of other user
  const { id } = req.params;

  try {
    // Finding the relation
    const {
      rows: { 0: relation },
    } = await slonik.query(sql`
    SELECT status FROM relations 
    WHERE to_user IN (${String(id)}, ${req.user?.id!!}) 
    AND from_user IN (${String(id)}, ${req.user?.id!!});
  `);

    return res.json(relation?.status || null);
  } catch (error) {
    // TODO: Handle invalid UUID ID error
  }
};

// For following another user
export const follow = async (req: Express.Request, res: Express.Response) => {
  // The ID of other user
  const { id } = req.params;

  try {
    const {
      rows: { 0: response },
    } = await slonik.query(sql<any>`
      INSERT INTO relations (status, to_user, from_user) 
      VALUES ('FOLLOWING', ${id}, ${req.user?.id!!})
      RETURNING status;
    `);

    return res.json(response?.status);
  } catch (error) {
    if (error instanceof ForeignKeyIntegrityConstraintViolationError) {
      return res.status(404).json();
    } else if (error instanceof UniqueIntegrityConstraintViolationError) {
      return res.status(409).json();
    } else console.error(error);
  }
};

// For unfollowing a user
export const unfollow = async (req: Express.Request, res: Express.Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    // Deleting the record
    const status = await slonik.query(sql`
      DELETE FROM relations
      WHERE to_user = ${id} 
      AND from_user = ${req?.user?.id!!} 
      AND status = 'FOLLOWING';
    `);

    console.log({ status });

    /**
     * Returning null because the user has unfollowed
     */
    return res.json(null);
  } catch (error) {}
};
