import { User } from "./User";

export class Post {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly created_at: Date,
    public readonly user?: Partial<User>,
    public readonly user_id?: string,
    public readonly content?: string
  ) {}
}
