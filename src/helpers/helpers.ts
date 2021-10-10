import getFirst from "../utils/getFirst";
import type { Relation } from "../types/relation";

// For checking if a user has blocked current user
export const checkStatus = async ({
  other,
  current,
}: {
  // Other user's ID
  other: string;
  // Current user's ID
  current: string;
}): Promise<Relation["status"]> => {
  const relation = await getFirst<Relation>(
    `
    SELECT * FROM relations WHERE to_user = $1
    AND from_user = $2 AND status = 'BLOCKED';
    `,
    [current, other]
  );

  return relation?.status!!;
};
