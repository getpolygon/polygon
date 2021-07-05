import _ from "lodash";
import bcrypt from "bcrypt";
import { sql } from "slonik";
import Express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../@types";
import slonik from "../../db/slonik";
const { JWT_PRIVATE_KEY } = process.env;
import emailValidator from "email-validator";

export default async (req: Express.Request, res: Express.Response) => {
  const { password } = req.body;
  const email = _.toLower(req.body.email);

  // If the email is valid and the password is provided
  if (emailValidator.validate(email) && password) {
    // Find the account with specified parameters
    const query = await slonik.query(sql<User>`
      SELECT * FROM users WHERE email = ${email};
    `);

    console.log(query);

    // Getting the user
    const user = query.rows[0];

    // If the account exists
    if (user) {
      const same = await bcrypt.compare(password, user.password);

      if (same) {
        jwt.sign({ id: user.id }, JWT_PRIVATE_KEY!!, {}, (err, token) => {
          if (err) console.error(err);
          else {
            return res
              .cookie("jwt", token, {
                signed: true,
                secure: true,
                httpOnly: true,
                sameSite: "none",
              })
              .json({ token });
          }
        });
      } else return res.status(403).send();
    } else return res.status(204).send();
  } else return res.status(400).send();
};
