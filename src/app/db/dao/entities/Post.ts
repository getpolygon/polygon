import type { User } from "./User";

export class Post {
  public readonly id?: string;
  public readonly upvotes?: number;
  public readonly upvoted?: boolean;
  public readonly comments?: number;
  public readonly created_at?: string;
  public readonly user?: Partial<User>;

  constructor(
    public readonly title: string,
    public readonly user_id: string,
    public readonly content?: string
  ) {}
}
