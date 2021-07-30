import Express from "express";
import slonik from "../../db/slonik";
import { Post, User } from "../../types";
import { InvalidInputError, sql } from "slonik";
import { checkStatus } from "../../helpers/helpers";

// For fetching one post
export const fetchOne = async (req: Express.Request, res: Express.Response) => {
  // The id of the post
  const { id } = req.params;

  // Getting the post
  const post = await slonik.maybeOne(sql`
      SELECT
        post.id,
        post.body,
        post.privacy,
        post.created_at,
        row_to_json(author) AS user,
        json_agg(comments) AS comments

      FROM posts post

      LEFT OUTER JOIN (
        SELECT 
            first_name, 
            last_name, 
            avatar, 
            id, 
            username 
        FROM users
      ) author ON post.user_id = author.id

      LEFT OUTER JOIN comments ON comments.post_id = post.id

      WHERE post.id = ${id!!} 
      GROUP BY post.id, author.* 
      ORDER BY post.created_at DESC;
  `);

  // If post exists
  if (post) return res.json(post);
  else return res.status(403).json();
};

// For fetching one user's post
export const fetch = async (req: Express.Request, res: Express.Response) => {
  const { cursor } = req.query;
  const { username } = req.params;

  // Getting the user
  const user = await slonik.maybeOne(sql<Partial<User>>`
    SELECT * FROM users WHERE username = ${username!!};
  `);

  // Checking the relation between this and other account
  const status = await checkStatus({
    other: user?.id!!,
    current: req?.user?.id!!,
  });

  // If other account has blocked this one
  if (status === "BLOCKED") return res.status(403).json();
  else {
    const offset = Number(cursor) || 0;
    const next = offset + 2;
    const prev = offset - 2;

    const user = await slonik.maybeOne(sql<User>`
      SELECT * FROM users WHERE username = ${username};
    `);

    // To determine whether there is a next page or not
    const { rows: nextPosts } = await slonik.query(sql<Partial<Post>[]>`
      SELECT * FROM posts Post
  
      WHERE Post.user_id = ${user?.id!!}
      ORDER BY Post.created_at
      LIMIT 2 OFFSET ${next};
    `);

    // Fetching the posts
    const { rows: posts } = await slonik.query(sql<Partial<Post>[]>`
      SELECT
        Post.id,
        Post.body,
        Post.privacy,
        Post.created_at,
        to_json(Author) AS user,
        to_json(array_remove(array_agg(Comments), NULL)) AS comments
  
      FROM posts Post
  
      LEFT OUTER JOIN (
        SELECT 
          id, 
          avatar, 
          private, 
          username, 
          last_name, 
          first_name 
        
        FROM users
      ) Author ON Author.id = Post.user_id
          
      LEFT OUTER JOIN (
        SELECT
          Comment.*,
          to_json(CommentAuthor) AS user
      
        FROM comments Comment

        LEFT OUTER JOIN (
          SELECT 
            id, 
            bio,
            avatar, 
            username, 
            first_name, 
            last_name
          
          FROM users
          ) CommentAuthor ON Comment.user_id = CommentAuthor.id
      ) Comments ON Post.id  = Comments.post_id
  
      WHERE Post.privacy <> 'PRIVATE'
      AND Author.username = ${username!!}
      GROUP BY Post.id, Author.*, Comments.*
      ORDER BY Post.created_at DESC
      LIMIT 2 OFFSET ${offset};
    `);

    return res.json({
      prev,
      data: posts,
      next: nextPosts.length === 0 ? null : next,
    });
  }
};

// For creating a post
export const create = async (req: Express.Request, res: Express.Response) => {
  const { body } = req.body;

  try {
    // Create new post
    const created = await slonik.maybeOne(sql<Partial<Post>>`
        INSERT INTO posts (body, user_id)
        VALUES (${body}, ${req.user?.id!!})

        RETURNING id;
    `);

    // Getting the post
    const post = await slonik.maybeOne(sql<Partial<Post>>`
        SELECT
          Post.*,
          to_json(Author) AS user,
          to_json(array_remove(array_agg(Comments), NULL)) AS comments

        FROM posts Post

        LEFT OUTER JOIN (
          SELECT 
            id, 
            avatar, 
            private, 
            username, 
            last_name, 
            first_name 
          
          FROM users
          ) Author ON Author.id = Post.user_id
        
        LEFT OUTER JOIN (
          
          SELECT
            Comment.*,
            to_json(CommentAuthor) AS user

          FROM comments Comment

          LEFT OUTER JOIN (
            SELECT 
              id, 
              bio,
              avatar, 
              username, 
              first_name, 
              last_name
            
            FROM users
            ) CommentAuthor ON Comment.user_id = CommentAuthor.id
            
        ) Comments ON Post.id  = Comments.post_id

        WHERE Post.id = ${created?.id!!}
        GROUP BY Post.id, Author.*, Comments.*
        ORDER BY Post.created_at DESC;
      `);

    // Sending the response
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

// For removing a post
export const remove = async (req: Express.Request, res: Express.Response) => {
  try {
    // Getting post id from the query
    const { id } = req.params;

    // Deleting from the database
    const post = await slonik.maybeOne(sql<Partial<Post>>`
      SELECT * FROM posts WHERE id = ${id!!};
    `);

    // Checking if the post exists
    if (post) {
      // If the author of the post is the same as current user
      if (post?.user_id === req.user?.id) {
        // Deleting the post
        await slonik.query(sql`
          DELETE FROM posts WHERE id = ${id.toString()};
        `);

        // Returing the response
        return res.status(204).json();
      } else return res.status(403).json();
    } else return res.status(404).json();
  } catch (error) {
    // TODO: Redundant
    // If the ID of the post is invalid
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};
