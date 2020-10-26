require("mongoose");
const router = require("express").Router();

const postSchema = require("../models/post");

router.get("/", (req, res) => {
  postSchema
    .find()
    .sort({ datefield: -1 })
    .then((doc) => {
      res.json(doc);
    })
    .catch((e) => console.log(e));
});

module.exports = router;
