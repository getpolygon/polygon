import getFirst from "util/sql/getFirst";

interface CheckStatusProps {
  // Other user's ID
  other: string;
  // Current user's ID
  current: string;
}

type Status = "BLOCKED" | "PENDING" | "FOLLOWING";

// For checking if a user has blocked current user
// prettier-ignore
const checkStatus = async ({ other, current }: CheckStatusProps): Promise<Status> => {
  const relation = await getFirst<{ status: Status }>(
    `
    SELECT status FROM relations WHERE to_user = $1
    AND from_user = $2 AND status = 'BLOCKED';
    `,
    [current, other]
  );

  return relation?.status!!;
};

export default checkStatus;
