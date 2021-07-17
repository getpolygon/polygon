import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";

// For fetching account details
export const fetchAccount = async (
  req: Express.Request,
  res: Express.Response
) => {
  // Get the username from the query
  const { username } = req.query;

  if (username) {
    // Finding the account with username
    const {
      rows: { 0: user },
    } = await slonik.query(sql`
    SELECT 
     id,
     bio,
     cover,
     avatar,
     private,
     username,
     last_name,
     first_name,
     created_at

    FROM users 
    WHERE username = ${String(username)};
  `);

    if (!user) return res.status(404).json();
    else return res.json(user);
  } else {
    // Finding the account with username
    const {
      rows: { 0: user },
    } = await slonik.query(sql`
        SELECT 
         id,
         bio,
         cover,
         avatar,
         private,
         username,
         last_name,
         first_name,
         created_at
    
        FROM users 
        WHERE id = ${req.user?.id!!};
      `);

    if (!user) return res.status(404).json();
    else return res.json(user);
  }
};

// For deleting account
export const deleteAccount = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { id: userId } = req?.user!!;

  const deleteUserResponse = await slonik.query(sql`
    DELETE FROM users WHERE id = ${userId};
  `);

  const deleteCommentsResponse = await slonik.query(sql`
    DELETE FROM comments WHERE user_id = ${userId};
  `);

  const { rows: posts } = await slonik.query(sql<object[]>`
    SELECT * 
    
    FROM posts
    
    LEFT OUTER JOIN attachments ON attachments.post_id = posts.id
    
    WHERE user_id = ${userId};
  `);

  return res.json({ deleteUserResponse, deleteCommentsResponse, posts });
};

// For updating account
export const updateAccount = async (
  req: Express.Request,
  res: Express.Response
) => {
  // TODO: Implement
};
