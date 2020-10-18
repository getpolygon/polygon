require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");

// Register
router.get("/register", (req, res) => {
    if (!req.cookies.email & !req.cookies.password) {
        res.clearCookie("email")
        res.clearCookie("password")
        res.render("register");
    } else {
        res.redirect("/auth/register")
    }
});

router.post("/register", async (req, res) => {
    const Account = new AccountSchema({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        pictureUrl: `https://firebasestorage.googleapis.com/v0/b/arm-social.appspot.com/o/${(req.body.email).replace("@", "%40")}.jpg?alt=media`,
        private: req.body.privateCheck ? true : false,
        date: Date.now()
    })

    var duplicateAccount = await AccountSchema.findOne({ email: Account.email })
        .then(list => {
            if (list == null) {
                return []
            } else {
                return list;
            }
        })

    if (Account.email == duplicateAccount.email) {
        res.render("register", { duplicateErr: "There is an account using this email. Try to login." });
    }
    if (duplicateAccount == null || Account.email != duplicateAccount.email) {
        await Account.save();
        res.cookie("email", Account.email, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("password", Account.password, { maxAge: 24 * 60 * 60 * 1000 });
        res.redirect(`/user/${Account._id}`);
    };
    if (e => {
        res.redirect("/");
        console.log(e);
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

router.post("/login", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const Account = await AccountSchema.findOne({ email: email, password: password })
        .then((doc) => {
            if (doc <= 0) {
                console.log(doc);
                return [];
            }
            else {
                console.log(doc.email)
                return doc;
            }
        })
        .catch(e => console.log(e));
    
    if (email != Account.email) {
        res.status(404).render("login", { err: "This account can't be found. Try checking your email and password and try again." });
    }
    // if (password != Account.password && Account.email == email) {
    //     res.status(403).render("login", { errPassword: "Your password is incorrect." });
    // } 
    else {
        res.cookie("email", email);
        res.cookie("password", password);
        res.redirect("/");
    }
    // (password == Account.password && email == Account.email)
})

module.exports = router;
