import { Post } from "./entities/Post";
import { BaseRepository } from "./common/BaseRepository";

export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super("posts");
  }
}
