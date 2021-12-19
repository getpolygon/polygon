export type Status = "BLOCKED" | "PENDING" | "FOLLOWING";

export class Relation {
  constructor(
    public readonly id: string,
    public readonly status: Status,
    public readonly to_user: string,
    public readonly from_user: string,
    public readonly created_at?: Date
  ) {}
}
