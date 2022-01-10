export class User {
  public readonly id?: string;
  public readonly bio?: string;
  public readonly created_at?: Date;

  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
    public readonly last_name: string,
    public readonly first_name: string
  ) {}
}
