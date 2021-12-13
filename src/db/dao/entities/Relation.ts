type RelationStatus = "PENDING" | "BLOCKED" | "FOLLOWNG";

export class Relation {
  constructor(
    public readonly id: string,
    public readonly to_user: string,
    public readonly created_at: Date,
    public readonly from_user: string,
    public readonly status: RelationStatus
  ) {}
}
