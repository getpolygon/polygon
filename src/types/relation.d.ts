export type Relation = {
  id: string;
  to_user: string;
  created_at: Date;
  from_user: string;
  status: "PENDING" | "FOLLOWING" | "BLOCKED";
};
