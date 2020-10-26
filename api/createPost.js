require("mongoose");
const router = require("express").Router();

const PostSchema = require("../models/post");
const AccountSchema = require("../models/account");

router.post("/", async (req, res) => {
  let authorAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password,
  });
  let author = authorAccount.fullName;
  let authorImage = authorAccount.pictureUrl;
  let authorId = authorAccount._id;

  const Post = new PostSchema({
    text: req.body.text,
    author: author,
    authorEmail: req.cookies.email,
    authorId: authorId,
    authorImage: authorImage,
    datefield: Date.now(),
  });

  await Post.save()
    .then((doc) => {
      res.send(doc);
      return;
    })
    .catch((e) => {
      console.log(e);
      return;
    });
});

module.exports = router;
