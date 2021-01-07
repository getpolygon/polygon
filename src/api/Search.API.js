const router = require("express").Router();
const AccountSchema = require("../models/account");
router.get("/", async (req, res) => {
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });
  const { query, limit } = req.query;
  const regex = new RegExp(query, "gui");
  await AccountSchema.find({
    fullName: regex
  })
    .limit(limit ? limit : 5)
    .where("_id")
    .ne(currentAccount._id)
    .then((doc) => res.json(doc))
    .catch((e) => console.error(e));
});
module.exports = router;
