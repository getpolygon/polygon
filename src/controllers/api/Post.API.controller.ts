import { sql } from "slonik";
import Express from "express";
import { Post } from "../../types";
import slonik from "../../db/slonik";
import textCleaner from "../../helpers/textCleaner";

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

  const offset = Number(cursor) || 0;
  const next = offset + 2;
  const prev = offset - 2;

  // To determine whether there is a next page or not
  const { rows: nextPosts } = await slonik.query(sql<Partial<Post>[]>`
    SELECT * FROM posts Post

    WHERE Post.privacy <> 'PRIVATE'
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
};

// For creating a post
export const create = async (req: Express.Request, res: Express.Response) => {
  // Post text
  const text = textCleaner(req.body.body);

  // Checking if there are no uploaded files
  // if (req.files?.length === 0) {

  try {
    // Create new post
    const created = await slonik.maybeOne(sql<Partial<Post>>`
        INSERT INTO posts (body, user_id)
        VALUES (${text}, ${req.user?.id!!})

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
    // } else {
    //   // TODO: Implement
    // }
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

        return res.status(204).json();
      } else return res.status(403).json();
    } else return res.status(404).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};
