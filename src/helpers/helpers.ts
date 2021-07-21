import { sql } from "slonik";
import slonik from "../db/slonik";
import { Relation, RelationStatus } from "../types";

interface BlockChecker {
  // Other user's ID
  other: string;
  // Current user's ID
  current: string;
}

// For checking if a user has blocked current user
export const checkStatus = async ({
  other,
  current,
}: BlockChecker): Promise<RelationStatus> => {
  const { rows } = await slonik.query!!(sql<Relation>`
    SELECT * FROM relations WHERE to_user = ${current} AND from_user = ${other} AND status = 'BLOCKED';
  `);

  return rows[0]?.status;
};
