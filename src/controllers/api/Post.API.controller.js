const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const minio = require("../../db/minio");
const { PostSchema } = require("../../models");
const textCleaner = require("../../helpers/textCleaner");

const PostAPIController = {
  // Get all posts
  fetch: async (req, res) => {
    const posts = await PostSchema.find()
      .populate(
        "author",
        "-notifications -friends -password -email -posts -createdAt -updatedAt"
      )
      .where("author")
      .ne(req.user.id)
      .where("author.private")
      .ne(true);

    res.json(posts);
  },
  // Create a post
  create: async (req, res) => {
    // Post text
    const text = textCleaner(req.body.text);
    // Post
    const post = new PostSchema({ body: text, author: req.user.id });

    // Checking if there are no uploaded files
    if (req.files.length === 0) {
      // Save the post
      await post.save();
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

        // Making path the object because at some point of time we might want to delete or update the post
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
  // Delete a post
  delete: async (req, res) => {
    const { id } = req.params;

    // Checking if post id is valid
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Finding the post
      const post = await PostSchema.findById(id);

      // If there's no such post
      if (!post) return res.status(404).send();
      else {
        // Checking if there are any attachments
        if (post.attachments.objects.length !== 0) {
          console.log("deleting files");
          // Deleting all attachments
          await minio.client.removeObjects(
            minio.config.MINIO_BUCKET,
            post.attachments.objects
          );
        }

        // Deleting the post
        const result = await PostSchema.findByIdAndDelete(id);
        // Checking if the result is successful
        if (!result) return res.status(404).send();
        else return res.status(200).send();
      }
    } else return res.status(400).send();
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
