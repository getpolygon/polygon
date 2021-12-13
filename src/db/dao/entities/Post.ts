export class Post {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly user_id: string,
    public readonly created_at: Date,
    public readonly content?: string
  ) {}
}
