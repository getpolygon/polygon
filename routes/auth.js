const router = require("express").Router();
const mongoose = require("mongoose");
const passportConfig = require("../config/passport");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const AccountSchema = require("../models/account");

router.get("/", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) => {

    req.body.private = false;

    const Account = new AccountSchema({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        private: req.body.private?false:true,
        date: Date.now()
    })

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Account.password, salt, (err, hash) => {
            if (err) throw err;

            // Set password to hashed
            Account.password = hash;
            // Save User
            Account.save()
                .then(Account => {
                    res.redirect(`/platform/${Account._id}`);
                })
                .catch(e => res.redirect("/"));

            console.log(Account);
        });
    });
});

// TODO: Update the login page 
router.get("/login", (req, res) => {
    res.render("login");
});

// TODO: Update the Login Handle -> https://youtu.be/6FOq4cUdH8k?t=4533
router.post("/login", (req, res) => {
    passport.authenticate("local", {
        successRedirect: "/platform",
        failureRedirect: "/login",
    })(req, res, next)
})

module.exports = router;
