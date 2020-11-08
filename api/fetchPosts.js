require("mongoose");
const router = require("express").Router();
const moment = require("moment");

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
            post.datefield = post.datefield;
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
          foundPosts.push(post);
        });
        res.json(foundPosts);
      })
      .catch(e => console.error(e));
  };
});

module.exports = router;
