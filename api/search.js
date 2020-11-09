const router = require("express").Router();

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
    const { query } = req.query;
    const regex = new RegExp(query, "gu");
    await AccountSchema
        .find({ "fullName": regex })
        .then(doc => {
            res.json(doc);
        })
        .catch(e => console.error(e));

});

module.exports = router;
