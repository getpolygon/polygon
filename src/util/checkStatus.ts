import getFirst from "./getFirst";

type RelationStatus = "BLOCKED" | "PENDING" | "FOLLOWING";

// For checking if a user has blocked current user
const checkStatus = async ({
  other,
  current,
}: {
  // Other user's ID
  other: string;
  // Current user's ID
  current: string;
}): Promise<RelationStatus> => {
  const relation = await getFirst<any>(
    `
    SELECT * FROM relations WHERE to_user = $1
    AND from_user = $2 AND status = 'BLOCKED';
    `,
    [current, other]
  );

  return relation?.status!!;
};

export default checkStatus;
