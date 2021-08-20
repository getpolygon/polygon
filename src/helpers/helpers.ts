import { sql } from "slonik";
import slonik from "../db/slonik";
import { Relation, RelationStatus } from "../types";

// For checking if a user has blocked current user
export const checkStatus = async ({
  other,
  current,
}: {
  // Other user's ID
  other: string;
  // Current user's ID
  current: string;
}): Promise<RelationStatus> => {
  const relation = await slonik.maybeOne!!(sql<Relation>`
    SELECT * FROM relations WHERE to_user = ${current} 
    AND from_user = ${other} AND status = 'BLOCKED';
  `);

  return relation?.status!!;
};
