import express from "express";
import pg from "../../../db/pg";
import checkStatus from "../../../utils/checkStatus";

// For getting the people whom the account follows
const following = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  try {
    // Checking the relation between 2 users
    const status = await checkStatus({ other: id, current: req.user?.id!! });

    // If not blocked
    if (status !== "BLOCKED") {
      // Getting the users other user follows
      const { rows: following } = await pg.query(
        `
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

        WHERE Following.from_user = $1 AND Following.status = 'FOLLOWING';
        `,
        [id]
      );

      return res.json(following);
    }

    return res.sendStatus(403);
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default following;
