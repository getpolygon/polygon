import Express from "express";
// import { nanoid } from "nanoid";
// import minio from "../../db/minio";
import { PrismaClient } from "@prisma/client";
import textCleaner from "../../helpers/textCleaner";

const prisma = new PrismaClient();

const PostAPIController = {
  fetch: async (req: Express.Request, res: Express.Response) => {
    const { accountId } = req.query;

    if (!accountId) {
      const posts = await prisma.post.findMany({
        where: {
          userId: {
            not: req.user?.id,
          },
          user: {
            privateAccount: false,
          },
        },
        include: {
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  bio: true,
                  roles: true,
                  avatar: true,
                  lastName: true,
                  username: true,
                  firstName: true,
                  privateAccount: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              bio: true,
              roles: true,
              avatar: true,
              lastName: true,
              username: true,
              firstName: true,
              privateAccount: true,
            },
          },
        },
      });

      return res.json(posts);
    } else {
      const posts = await prisma.post.findMany({
        where: {
          userId: {
            not: req.user?.id,
          },
          user: {
            privateAccount: false,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              bio: true,
              roles: true,
              avatar: true,
              lastName: true,
              username: true,
              firstName: true,
              privateAccount: true,
            },
          },
        },
      });

      return res.json(posts);
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
        const post = await prisma.post.create({
          data: {
            body: text,
            userId: req.user?.id!!,
          },
          include: {
            user: {
              select: {
                id: true,
                bio: true,
                roles: true,
                avatar: true,
                username: true,
                lastName: true,
                firstName: true,
              },
            },
            comments: true,
          },
        });
        // Send the response
        return res.status(201).json(post);
      } else {
        // // Initializing the payload
        // const data = {
        //   body: null,
        //   attachments: [],
        // };
        // // Looping through each file and creating an object in minio
        // for (const file of req.files) {
        //   // Creating a random ID
        //   const uuid = nanoid();
        //   // Getting the properties
        //   const { buffer, size, mimetype } = file;
        //   // Creating a path for the file
        //   const objectPath = `${req.user?.id}/media/${uuid}.${
        //     file.mimetype.split("/")[1]
        //   }`;
        //   // Making path the object because at some point of
        //   // time we might want to delete or update the post
        //   // URL for accessing the object
        //   const url = `${minio.config.MINIO_ENDPOINT}:${minio.config.MINIO_PORT}/${minio.config.MINIO_BUCKET}/${objectPath}`;
        //   // Pushing the name of the object to the attachment object array
        //   data.attachments.objects.push(objectPath);
        //   // Pushing the generated url and mimetype to the array
        //   data.attachments.urls.push({
        //     url,
        //     mimetype: file.mimetype.split("/")[0],
        //   });
        //   // Saving the file
        //   await minio.client.putObject(
        //     minio.config.MINIO_BUCKET,
        //     objectPath,
        //     buffer,
        //     size,
        //     {
        //       "Content-Type": mimetype,
        //     }
        //   );
      }
    }
  },
  delete: async (req: Express.Request, res: Express.Response) => {
    res.status(501).send();
  },
  save: (req: Express.Request, res: Express.Response) => res.status(501).send(),
  heart: (req: Express.Request, res: Express.Response) => {
    res.status(501).send();
  },
  unsave: (req: Express.Request, res: Express.Response) => {
    res.status(501).send();
  },
  unheart: (req: Express.Request, res: Express.Response) => {
    res.status(501).send();
  },
  update: (req: Express.Request, res: Express.Response) => {
    res.status(501).send();
  },
};

export default PostAPIController;
