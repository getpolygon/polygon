import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";
// import minio from "../../db/minio";
import textCleaner from "../../helpers/textCleaner";

//  WHERE id <> ${req.user?.id!!}

const PostAPIController = {
  fetch: async (req: Express.Request, res: Express.Response) => {
    const { accountId } = req.query;

    if (!accountId) {
      // TODO: Only allow public user's public posts to be discovered
      const posts = await slonik.query(sql`
        SELECT post.*, row_to_json(author) AS user 
        FROM posts post
          LEFT JOIN 
            (SELECT first_name, last_name, avatar, id, username FROM users) author
              ON post.user_id = author.id
            
        WHERE user_id <> ${req.user?.id!!}
      `);

      return res.json(posts.rows);
    } else {
      // TODO: Only allow public user's public posts to be discovered
      const posts = await slonik.query(sql`
            SELECT post.*, row_to_json(author) AS user 
            FROM posts post
              LEFT JOIN 
                (SELECT first_name, last_name, avatar, id, username FROM users) author
                  ON post.user_id = author.id
                
            WHERE user_id = ${accountId.toString()}
          `);

      return res.json(posts.rows);
    }
  },

  create: async (req: Express.Request, res: Express.Response) => {
    // If no text is present prevent the user from posting
    if (!req.body.text) return res.status(401).send();
    else {
      // Post text
      const text = textCleaner(req.body.text);

      // Checking if there are no uploaded files
      if (req.files?.length === 0) {
        // Create new post
        const post = await slonik.query(sql`
          INSERT INTO posts (body, user_id)
          VALUES (${text}, ${req.user?.id!!})
          RETURNING *;
        `);

        // Sending the response
        return res.json(post.rows[0]);
      } else {
        // TODO: Needs to be implemented
      }
    }
  },
  save: (req: Express.Request, res: Express.Response) => {},
  heart: (req: Express.Request, res: Express.Response) => {},
  delete: (req: Express.Request, res: Express.Response) => {},
  update: (req: Express.Request, res: Express.Response) => {},
  unsave: (req: Express.Request, res: Express.Response) => {},
  unheart: (req: Express.Request, res: Express.Response) => {},
};

export default PostAPIController;
