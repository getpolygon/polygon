require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");
const PostSchema = require("../models/post");

router.post("/", async (req, res) => {
  const email = req.cookies.email;
  const password = req.cookies.password;

  Promise.all([
    // Find posts and the account associated with the email
    await PostSchema.deleteMany({ authorEmail: email }),
    await AccountSchema.findOneAndDelete({ email: email, password: password }),
  ])
    .then(result => {
      res.clearCookie("email");
      res.clearCookie("password");
      res.json({ "result": result });
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
