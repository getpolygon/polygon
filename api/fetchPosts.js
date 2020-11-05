require("mongoose");
const router = require("express").Router();
const moment = require("moment");

const AccountSchema = require("../models/account");

router.get("/", (req, res) => {
  AccountSchema
    .find()
    .then((doc) => {
      let foundPosts = [];
      doc.forEach(account => {
        account.posts.forEach(post => {
          foundPosts.push(post);
        })
      })
      res.json(foundPosts);
    })
    .catch((e) => console.log(e));
});

module.exports = router;
