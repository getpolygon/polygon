require("mongoose");
const router = require("express").Router();
// Required to convert unix timestamp to readable time
const { fromUnixTime, format } = require("date-fns");

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
  const currentAccount = await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password });
  let { accountId} = req.query;

  if (!accountId) {
    await AccountSchema
      .find({ isPrivate: false })
      // Exclude current account from the results
      .where({ id: !currentAccount._id })
      .then((doc) => {
        let foundPosts = [];
        doc.forEach(account => {
          account.posts.forEach(post => {
            post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
            foundPosts.push(post);
          })
        });
        /* Instead we are finding our posts here
         * Doing this because user's account could be private
         * By doing this they'll be able to see their posts
         */
        currentAccount.posts.forEach(post => {
          post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
          foundPosts.push(post);
        });
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
