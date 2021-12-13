export class Upvote {
  constructor(
    public readonly id: string,
    public readonly user_id: string,
    public readonly post_id: string,
    public readonly created_at: Date
  ) {}
}
