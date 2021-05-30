const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const minio = require("../../db/minio");
const { PostSchema } = require("../../models");
const textCleaner = require("../../helpers/textCleaner");

// TODO: continue implementation
const PostAPIController = {
  // Get all posts
  fetch: async (req, res) => {
    const posts = await PostSchema.find()
      .where("author._id")
      .ne(req.user._id)
      .limit(15);

    res.json(posts);
  },
};

// Get all posts
exports.fetch = async (req, res) => {
  const posts = await PostSchema.find()
    .where("author._id")
    .ne(req.user._id)
    .limit(15);

  res.json(posts);
};

// Create a post
exports.create = async (req, res) => {
  // Post text
  const text = textCleaner(req.body.text);
  // Post
  // TODO: Fix a bug in the account or post. The issue is that the `posts` property on account is not being modified
  const post = new PostSchema({ text, author: req.user._id });

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
      const path = `${req.user._id}/media/${uuid}.${
        file.mimetype.split("/")[1]
      }`;

      // Making path the object because at some point of time we might want to delete or update the post
      const object = path;
      // URL for accessing the object
      const url = `${minio.config.MINIO_ENDPOINT}:${minio.config.MINIO_PORT}/${minio.config.MINIO_BUCKET}/${path}`;

      // Pushing the name of the object to the attachment object array
      post.attachments.objects.push(object);
      // Pushing the generated url to the array
      post.attachments.urls.push(url);

      // Saving the file
      await minio.client.putObject(
        minio.config.MINIO_BUCKET,
        path,
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
};
// Save a post
exports.save = (req, res) => res.status(501).send();
// Edit a post
exports.edit = (req, res) => res.status(501).send();
// Heart a post
exports.heart = (req, res) => res.status(501).send();
// Delete a post
exports.delete = async (req, res) => {
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
};
// Unheart a post
exports.unheart = (req, res) => res.status(501).send();
// Unsave a post
exports.unsave = (req, res) => res.status(501).send();
// Update a post
exports.update = (req, res) => res.status(501).send();
