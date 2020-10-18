require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account")

// Main page
router.get("/", async (req, res) => {

    var emailCookie = req.cookies.email;
    var passwordCookie = req.cookies.password;

    /*
        * Check for cookies before rendering the index
        * If cookies persist redirect to the platform.ejs
        * If not redirect to either login or register (Maybe login)
    */

    if (!emailCookie && !passwordCookie) {
        res.redirect("/auth/login");
    } else {
        Promise.all([
            await AccountSchema.find({ private: false }),
            await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password })
        ])
            .then(([accounts, currentAccount]) => {
                res.render("platform", { accounts: accounts, currentAccount: currentAccount, err: "We couldn't find any public accounts." });
            })
            .catch(([err1, err2]) => {
                res.clearCookie("email", req.params.accountId);
                res.clearCookie("password", req.params.accountId);
                res.redirect("/auth/login", { err1: err1, err2: err2 });

                console.log(err1);
                console.log(err2);
            });
    };
});

// User's Account Page
router.get("/user/:accountId", async (req, res) => {

    if (!req.cookies.email || !req.cookies.password) {
        res.redirect("/");
    } else {
        const accountId = await req.params.accountId;
        const currentAccount = await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password });
        const platformAccount = await AccountSchema.findById(accountId);
        res.render("platformAccount", { currentAccount: currentAccount, platformAccount: platformAccount });
    };
});

// Logout
router.post("/logout/:accountId", (req, res) => {
    res.clearCookie("email", req.params.accountId);
    res.clearCookie("password", req.params.accountId);
    res.redirect("/");
})

module.exports = router;
