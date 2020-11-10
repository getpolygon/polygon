require("mongoose");
const router = require("express").Router();
// Required to convert unix timestamp to readable time
const { fromUnixTime, format } = require("date-fns");

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
  let { accountId } = req.query;

  if (!accountId) {
    await AccountSchema
      .find()
      .then((doc) => {
        let foundPosts = [];
        doc.forEach(account => {
          account.posts.forEach(post => {
            post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
            foundPosts.push(post);
          })
        })
        res.json(foundPosts);
      })
      .catch((e) => console.log(e));
  }
  if (accountId) {
    await AccountSchema
      .findById(accountId)
      .then((doc) => {
        let foundPosts = [];
        doc.posts.forEach(post => {
          post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
          foundPosts.push(post);
        });
        res.json(foundPosts);
      })
      .catch(e => console.error(e));
  };
});

module.exports = router;
