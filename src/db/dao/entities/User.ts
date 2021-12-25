export class User {
  // Fields that are most probably not gonna be used
  public readonly id: any;
  public readonly bio: any;
  public readonly created_at: any;

  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
    public readonly last_name: string,
    public readonly first_name: string
  ) {}
}
