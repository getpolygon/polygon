import { PostRepository } from "./PostRepository";
import { UserRepository } from "./UserRepository";

const postRepository = new PostRepository();
const userRepository = new UserRepository();

export { postRepository, userRepository };
