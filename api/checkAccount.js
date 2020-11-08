require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");

router.put("/", async (req, res) => {
    let email = req.query.email;
    let password = req.query.password;

    AccountSchema.findOne({ email: email, password: password })
        .then(doc => {
            if (doc) {
                res.json(doc);
            } else {
                res.json([]);
            };
        })
        .catch(e => {
            res.json(e);
            console.log(e);
        });
});

module.exports = router;
