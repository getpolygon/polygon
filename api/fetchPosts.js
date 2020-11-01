require("mongoose");
const router = require("express").Router();
const moment = require("moment");

const postSchema = require("../models/post");

router.get("/", (req, res) => {
  postSchema
    .find()
    .sort({ datefield: -1 })
    .then((doc) => {
      // Sending the updated doc
      res.json(doc);
    })
    .catch((e) => console.log(e));
});

module.exports = router;
