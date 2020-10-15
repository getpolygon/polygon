require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account")

router.get("/:accountId", async(req, res) => {
    const accountId = await req.params.accountId;
    const Account = await AccountSchema.findById(accountId);
    res.render("platformAccount", { account: Account });
});

router.get("/", async(req, res) => {
    await AccountSchema.find({ private: false })
        .then(acc => {
            res.render("platform", { accounts: acc, err: "We couldn't find any public accounts." });
        })
        .catch(e => {
            console.log(e);
        });
});

module.exports = router;