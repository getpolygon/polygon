require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");

// Register
router.get("/register", (req, res) => {

    if (!req.cookies.email & !req.cookies.password) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.render("register");
    } else {
        res.redirect("/")
    }
});

router.post("/register", async (req, res) => {

    const Account = new AccountSchema({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        pictureUrl: `https://firebasestorage.googleapis.com/v0/b/arm-social.appspot.com/o/${(req.body.email).replace("@", "%40")}.jpg?alt=media`,
        private: req.body.private ? false : true,
        date: Date.now()
    })

    await Account.save()
        .then(Account => {
            res.cookie("email", Account.email, { expires: 24 * 60 * 60 * 1000 });
            res.cookie("password", Account.password, { expires: 24 * 60 * 60 * 1000 });
            console.log(req.cookies);
            res.redirect(`/user/${Account._id}`);
        })
        .catch(e => {
            console.log(e);
            res.redirect("/");
        });
});


// Login
router.get("/login", (req, res) => {

    if (!req.cookies.email && !req.cookies.password) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.render("login");
    } else {
        res.redirect("/");
    };

})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const Account = await AccountSchema.findOne({ email: email, password: password })
    if (email != Account.email || password != Account.password) {
        res.redirect("/");
    }
    else {
        res.cookie("email", email);
        res.cookie("password", password);
        res.redirect("/");
    }
})

module.exports = router;
