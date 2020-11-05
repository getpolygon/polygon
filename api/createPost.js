require("mongoose");
const router = require("express").Router();
// const moment = require("moment");

const AccountSchema = require("../models/account");

router.post("/", async (req, res) => {
  let authorAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password,
  });
  let author = authorAccount.fullName;
  let authorImage = authorAccount.pictureUrl;
  let authorId = authorAccount._id;

  const Post = {
    text: req.body.text,
    author: author,
    authorEmail: req.cookies.email,
    authorId: authorId,
    authorImage: authorImage,
    datefield: Date.now(),
  };

  let newPost = authorAccount.posts.push(Post);
  let post = authorAccount.posts.create(Post);

  await authorAccount
    .save()
    .then(res.json(post))
    .catch(e => console.error(e));
  
});

module.exports = router;
