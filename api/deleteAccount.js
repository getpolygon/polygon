require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");
const PostSchema = require("../models/post");

router.post("/", (req, res) => {

    const email = req.cookies.email;
    const password = req.cookies.password;

    Promise.all([
        await AccountSchema.findOneAndDelete({ email: email, password: password }),
        await PostSchema.deleteMany({ email: email })
    ]).then(([accountDeleteResult, _postsDeleteResult]) => {
        res.clearCookie("email");
        res.clearCookie("password");
        res.json(accountDeleteResult);
        res.redirect("/");
    })
        .catch(([err1, err2]) => {
            res.clearCookie("email");
            res.clearCookie("password");
            res.redirect("/");
            console.log([err1, err2].toString());
        })
})

module.exports = router;
