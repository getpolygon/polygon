import pg from "../../db/pg";
import express from "express";
import checkStatus from "../../utils/checkStatus";

// For getting the followers of an account
const followers = async (req: express.Request, res: express.Response) => {
  // The ID of the user
  const { id } = req.params;

  try {
    // Checking the status between 2 users
    const status = await checkStatus({ other: id, current: req.user?.id!! });

    // If current user is blocked by the other one
    if (status !== "BLOCKED") {
      const { rows: followers } = await pg.query(
        `
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
            AND Relation.to_user = $1;
            `,
        [id]
      );

      return res.json(followers);
    } else return res.status(403).json();
  } catch (error) {
    // TODO: Handle invalid user UUID errors
    // // If the id of the user is invalid
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // // Undefined behaviour
    // else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};

export default followers;
