import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";

export const getFollowers = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { id } = req.params;

  const {
    rows: { 0: blocked },
  } = await slonik.query(sql`
    SELECT * FROM relations WHERE to_user = ${req.user
      ?.id!!} AND status = 'BLOCKED' AND from_user = ${id};
  `);

  if (!blocked) {
    const { rows: followers } = await slonik.query(sql`
      SELECT Follower.* FROM relations Relation

      LEFT OUTER JOIN 
        (
          SELECT 
            id,
            cover,
            avatar,
            username,
            last_name,
            first_name

          FROM users
        ) Follower
          ON 
            Relation.from_user = Follower.id

      WHERE 
        Relation.status = 'FOLLOWING' 
          AND 
            Relation.to_user = ${id};
    `);

    return res.json(followers);
  } else return res.status(403).json();
};

export const checkRelationship = (
  req: Express.Request,
  res: Express.Response
) => {
  return res.status(500).json();
};
