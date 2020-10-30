require("mongoose");
const router = require("express").Router();

const PostSchema = require("../models/post");
const AccountSchema = require("../models/account");

router.post("/", async (req, res) => {
    let currentEmail = req.cookies.email;
    let currentPassword = req.cookies.password;
    let currentAccount = await AccountSchema.findOne({ email: currentEmail, password: currentPassword });

    let post = req.query.postId;
    let foundPost = await PostSchema.findById(post);

    if (foundPost.authorId != currentAccount._id) {
        res.json({ err: "Forbidden" }).status(403);
    }
    if (!foundPost) {
        res.json({ err: undefined });
    }
    else {
        await foundPost.remove()
            .catch(e => {
                console.log(e);
            });
        res.json({ result: "Removed" });
    }
});

module.exports = router;