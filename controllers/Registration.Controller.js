const router = require("express").Router();
const fetch = require("node-fetch");
const AccountSchema = require("../models/account");
const avatarLinks = ["/static/img/1.png", "/static/img/2.png", "/static/img/3.png", "/static/img/4.png", "/static/img/5.png", "/static/img/6.png",];

// Registration Page
router.get("/", (req, res) => {
    if (!req.cookies.email & !req.cookies.password) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.render("register", { title: "Register | ArmSocial" });
    } else {
        res.redirect("/auth/register");
    }
});

// To register the account
router.post("/", async (req, res) => {
    let Account = new AccountSchema({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.lastName}`,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        pictureUrl: req.body.avatar,
        isPrivate: req.body.privateCheck ? true : false,
        date: Date.now(),
    });

    // If a custom image was selected by the client set the picture URL to Firebase's  CDN
    if (req.body.avatar) {
        Account.pictureUrl = `https://firebasestorage.googleapis.com/v0/b/arm-social.appspot.com/o/${req.body.email.replace("@", "%40")}.jpg?alt=media`;
    }
    // If no custom image was selected select a default image from the list 
    else {
        Account.pictureUrl = avatarLinks[Math.floor(Math.random() * avatarLinks.length)];
    };

    await Account.save()
        .then(() => {
            res.cookie("email", Account.email, { maxAge: 24 * 60 * 60 * 1000 });
            res.cookie("password", Account.password, {
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.redirect(`/user/${Account._id}`);
        })
        .catch((e) => {
            res.redirect("/");
            console.log(e);
        });
});

module.exports = router;