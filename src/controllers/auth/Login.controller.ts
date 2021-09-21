import bcrypt from "bcrypt";
import { sql } from "slonik";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../@types";
import slonik from "../../db/slonik";
const { JWT_PRIVATE_KEY } = process.env;

export default async (req: express.Request, res: express.Response) => {
  // Get the email and the password
  const { password, email } = req.body;

  // Find the user with specified parameters
  const {
    rows: { 0: user },
  } = await slonik.query(sql<User>`
      SELECT * FROM users WHERE email = ${email};
  `);

  // If user exists
  if (user) {
    // Comparing passwords
    const same = await bcrypt.compare(password, user.password);

    // If passwords match
    if (same) {
      // Create a JWT
      jwt.sign({ id: user.id }, JWT_PRIVATE_KEY!!, {}, (error, token) => {
        if (error) return res.status(500).json();
        else {
          // Send the JWT as a cookie
          return res
            .status(204)
            .cookie("jwt", token, {
              signed: true,
              secure: true,
              httpOnly: true,
              sameSite: "none",
            })
            .json();
        }
      });
    } else return res.status(403).json();
  } else return res.status(404).json();
};
