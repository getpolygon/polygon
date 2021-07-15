import fs from "fs";
import pug from "pug";
import _ from "lodash";
import path from "path";
import bcrypt from "bcrypt";
import Express from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import redis from "../../db/redis";
// import minio from "../../db/minio";
// import { User } from "../../@types";
import slonik from "../../db/slonik";
const { BASE_FRONTEND_URL } = process.env;
// import { v4 as uuidv4 } from "uuid";
// import { generatePinSync } from "secure-pin";
const { JWT_PRIVATE_KEY, SALT_ROUNDS } = process.env;
import { send as SendMail } from "../../helpers/mailer";
// import generateDicebearUrl from "../../utils/generateDicebearUrl";
import {
  sql,
  // UniqueIntegrityConstraintViolationError
} from "slonik";

export const register = async (req: Express.Request, res: Express.Response) => {
  // Reading the template
  const template = fs
    .readFileSync(path.resolve("src/templates/verification.pug"))
    .toString();

  // Getting the IP from the request
  const { ip } = req;
  // Generating a random id
  const sid = nanoid(100);
  // Getting the properties from the body
  const { firstName, lastName, email, password, username } = req.body;

  // Checking whether there are other accounts with this email
  const sqlRequest = await slonik.query(sql`
    SELECT * FROM users WHERE email = ${email} OR username = ${username};
  `);

  // If there are no duplicate accounts
  if (!sqlRequest.rows[0]) {
    // Rendering the template
    const rendered = pug.render(template, {
      ip,
      sid,
      lastName,
      firstName,
      BASE_FRONTEND_URL,
    });

    // Sending an email
    SendMail({
      html: rendered,
      receiver: email,
      subject: "Polygon email verification",
    });

    // Creating a payload
    const payload = {
      email,
      username,
      lastName,
      firstName,
      password: bcrypt.hashSync(password, parseInt(SALT_ROUNDS!!)),
    };

    // Setting a random key with initial, stringified values
    redis.set(sid, JSON.stringify(payload), (error, _) => {
      // Sending an error on error
      if (error) return res.status(500).send();
      else {
        // Set an expiration date on the key
        redis.expire(sid, 60 * 5, (error, _) => {
          // Sending an error on error
          if (error) return res.status(500).send();
          // Sending a "No Content" response on success
          else return res.status(204).send();
        });
      }
    });
  } else return res.status(403).send();
};

// For verifying account
export const verify = (req: Express.Request, res: Express.Response) => {
  // Getting the token
  const { sid } = req.params;
  // Getting the password
  const { password } = req.body;

  // Getting the token
  redis.get(sid, async (error, value) => {
    // If there was an error
    if (error) {
      console.error(error);
      return res.status(500).send();
    } else {
      // If there's no such key
      if (!value) return res.status(404).send();
      else {
        // Parsing the stringified payload
        const payload = JSON.parse(value);
        // Comparing the passwords
        const same = bcrypt.compareSync(password, payload.password);

        // If passwords match
        if (same) {
          const {
            rows: { 0: user },
          } = await slonik.query(sql`
            INSERT INTO users (
              email, 
              password, 
              username,
              last_name, 
              first_name
            )

            VALUES (
              ${payload.email},
              ${payload.password},
              ${payload.username},
              ${payload.lastName},
              ${payload.firstName}
            )

            RETURNING *;
          `);

          jwt.sign(
            { id: user.id },
            JWT_PRIVATE_KEY!!,
            {
              expiresIn: "7 days",
            },
            (error, token) => {
              if (error) console.error(error);
              else {
                // Deleting the sid from Redis
                redis.del(sid, (error, _) => {
                  if (error) console.error(error);
                  else {
                    // Sending a token as a response
                    return res
                      .status(201)
                      .cookie("jwt", token!!, {
                        secure: true,
                        signed: true,
                        httpOnly: true,
                        sameSite: "none",
                      })
                      .json(user);
                  }
                });
              }
            }
          );
        } else return res.status(401).send();
      }
    }
  });
};

// export default async (req: Express.Request, res: Express.Response) => {
//   // Getting the fields
//   const { password, firstName, lastName, email, username } = req.body;

//   try {
//     // Hashing the password
//     const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS!!));
//     // Creating new user object to later retrieve the values from
//     const data = {
//       email,
//       lastName,
//       username,
//       firstName,
//       cover: "",
//       avatar: "",
//       password: hashedPassword,
//     };

//     // Check if there's a attached profile picture
//     if (!req.file) {
//       // Getting the properties
//       const { firstName, lastName } = data;
//       // Setting the avatar URL to an image generated by an external API
//       data.avatar = generateDicebearUrl(firstName, lastName);
//     } else {
//       // Getting file format
//       const format = req.file.mimetype.split("/")[1];
//       // Creating a unique filename
//       const path = `${uuidv4()}.${format}`;
//       // Uploading to MinIO
//       const etag = await minio.client.putObject(
//         minio.config.MINIO_BUCKET!!,
//         path,
//         req.file.buffer,
//         req.file.size,
//         {
//           "Content-Type": req.file.mimetype,
//         }
//       );
//       data.avatar = path;
//     }

//     // Creating the account
//     const {
//       rows: { 0: user },
//     } = await slonik.query<Partial<User>>(sql`
//         INSERT INTO users (
//           first_name,
//           last_name,
//           email,
//           password,
//           username,
//           avatar
//         )

//         VALUES (
//           ${data.firstName},
//           ${data.lastName},
//           ${data.email},
//           ${data.password},
//           ${data.username},
//           ${data.avatar}
//           )

//         RETURNING *;
//       `);

//     // Creating an account token
//     jwt.sign(
//       { id: user.id },
//       JWT_PRIVATE_KEY!!,
//       {
//         expiresIn: "7 days",
//       },
//       (err, token) => {
//         if (err) console.error(err);
//         else {
//           // Sending a token as a response
//           return res
//             .status(201)
//             .cookie("jwt", token!!, {
//               secure: true,
//               signed: true,
//               httpOnly: true,
//               sameSite: "none",
//             })
//             .json({ token });
//         }
//       }
//     );
//   } catch (error) {
//     if (error instanceof UniqueIntegrityConstraintViolationError) {
//       return res.status(403).send();
//     } else {
//       console.error(error);
//       return res.status(500).send();
//     }
//   }
// };
