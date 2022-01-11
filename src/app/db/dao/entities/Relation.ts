export type Status = "BLOCKED" | "PENDING" | "FOLLOWING";

export class Relation {
  public readonly id?: string;
  public readonly status?: Status;
  public readonly created_at?: Date;

  constructor(
    public readonly to_user: string,
    public readonly from_user: string
  ) {}
}
