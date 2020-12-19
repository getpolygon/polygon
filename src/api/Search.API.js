const router = require("express").Router();
const AccountSchema = require("../models/account");
router.get("/", async (req, res) => {
  const currentAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
  });
  const { query } = req.query;
  const regex = new RegExp(query, "gu");
  await AccountSchema.find({
    fullName: regex
  })
    .where("_id")
    .ne(currentAccount._id)
    .then((doc) => res.json(doc))
    .catch((e) => console.error(e));
});
module.exports = router;
