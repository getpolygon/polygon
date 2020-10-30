require("mongoose");
const router = require("express").Router();
const moment = require("moment");

const postSchema = require("../models/post");

router.get("/", (req, res) => {
  postSchema
    .find()
    .sort({ datefield: -1 })
    .then((doc) => {
      doc.forEach(item => {
        // Converting to human readable date format
        return item.datefield = moment().calendar(this.datefield)
      })
      // Sending the updated doc
      res.json(doc);
    })
    .catch((e) => console.log(e));
});

module.exports = router;
