import { Entity } from "../common/Entity";

export class User extends Entity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
    public readonly lastName: string,
    public readonly firstName: string,

    public readonly bio?: string,
    public readonly cover?: string,
    public readonly avatar?: string,
    public readonly createdAt?: Date
  ) {
    super();
  }
}
