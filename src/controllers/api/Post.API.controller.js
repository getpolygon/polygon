const Express = require("express");
const { nanoid } = require("nanoid");
const minio = require("../../db/minio");
const prisma = require("../../db/prisma");
const textCleaner = require("../../helpers/textCleaner");

const PostAPIController = {
  /**
   * Get post(s)
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  fetch: async (req, res) => {
    const { accountId } = req.query;

    if (!accountId) {
      const posts = await prisma.post.findMany({
        where: {
          userId: {
            not: req.user.id,
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
                  role: true,
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
              email: false,
              posts: false,
              password: false,
              comments: false,
              createdAt: false,
              id: true,
              bio: true,
              role: true,
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
            not: req.user.id,
          },
          user: {
            privateAccount: false,
          },
        },
        include: {
          user: {
            select: {
              email: false,
              posts: false,
              password: false,
              comments: false,
              createdAt: false,
              id: true,
              bio: true,
              role: true,
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
  /**
   * For creating a post
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response}
   */
  create: async (req, res) => {
    // Post text
    const text = textCleaner(req.body.text);

    // Checking if there are no uploaded files
    if (req.files.length === 0) {
      // Create new post
      const post = await prisma.post.create({
        data: {
          body: text,
          userId: req.user.id,
        },
        include: {
          user: {
            select: {
              avatar: true,
              bio: true,
              firstName: true,
              id: true,
              lastName: true,
              role: true,
              username: true,
            },
          },
          comments: true,
        },
      });
      // Send the response
      return res.status(201).json(post);
    } else {
      for (const file of req.files) {
        // Creating a random ID
        const uuid = nanoid();
        // Getting the properties
        const { buffer, size, mimetype } = file;
        // Creating a path for the file
        const objectPath = `${req.user._id}/media/${uuid}.${
          file.mimetype.split("/")[1]
        }`;

        // Making path the object because at some point of
        // time we might want to delete or update the post
        // URL for accessing the object
        const url = `${minio.config.MINIO_ENDPOINT}:${minio.config.MINIO_PORT}/${minio.config.MINIO_BUCKET}/${objectPath}`;

        // Pushing the name of the object to the attachment object array
        post.attachments.objects.push(objectPath);
        // Pushing the generated url and mimetype to the array
        post.attachments.urls.push({
          url,
          mimetype: file.mimetype.split("/")[0],
        });

        // Saving the file
        await minio.client.putObject(
          minio.config.MINIO_BUCKET,
          objectPath,
          buffer,
          size,
          {
            "Content-Type": mimetype,
          }
        );
      }

      // Saving the post
      await post.save();
      return res.status(201).json(post);
    }
  },
  /**
   * For deleting a post
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response}
   */
  delete: async (req, res) => {
    const { id } = req.params;
    // TODO: Implement
  },
  /**
   * TODO: Implement
   * Save a post
   */
  save: (req, res) => res.status(501).send(),
  /**
   * TODO: Implement
   * Unsave a post
   */
  unsave: (req, res) => res.status(501).send(),
  /**
   * TODO: Implement
   * Heart a post
   */
  heart: (req, res) => res.status(501).send(),
  /**
   * TODO: Implement
   * Unheart a post
   */
  unheart: (req, res) => res.status(501).send(),
  /**
   * TODO: Implement
   * Update a post
   */
  update: (req, res) => res.status(501).send(),
};

module.exports = PostAPIController;
