import { User } from "./User";

export class Post {
  public readonly id?: string;
  public readonly created_at?: string;
  public readonly user?: Partial<User>;

  constructor(
    public readonly title: string,
    public readonly user_id: string,
    public readonly content?: string
  ) {}
}
