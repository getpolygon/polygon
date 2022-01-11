export class Upvote {
  public readonly id?: string;
  public readonly created_at?: Date;

  constructor(
    public readonly user_id: string,
    public readonly post_id: string
  ) {}
}
