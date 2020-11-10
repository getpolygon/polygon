require("mongoose");
const router = require("express").Router();
const { fromUnixTime, format } = require("date-fns");

const AccountSchema = require("../models/account");

router.put("/", async (req, res) => {
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

  authorAccount.posts.push(Post);
  let post = authorAccount.posts.create(Post);

  await authorAccount
    .save()
    .then(() => {
      post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
      res.json(post)
    })
    .catch(e => console.error(e));
  
});

module.exports = router;
