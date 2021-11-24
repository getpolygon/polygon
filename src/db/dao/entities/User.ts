import { Entity } from "../common/Entity";

export class User extends Entity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
    public readonly last_name: string,
    public readonly first_name: string,

    public readonly bio?: string,
    public readonly cover?: string,
    public readonly avatar?: string,
    public readonly created_at?: Date
  ) {
    super();
  }
}
