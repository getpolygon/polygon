import { Post } from "./entities/Post";
import { PostgresBaseRepository } from "./common/PostgresBaseRepository";

export class PostRepository extends PostgresBaseRepository<Post> {
  constructor() {
    super("posts");
  }
}
