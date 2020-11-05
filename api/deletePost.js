require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");

router.post("/", async (req, res) => {
    let currentEmail = req.cookies.email;
    let currentPassword = req.cookies.password;
    let post = req.query.postId;

    await AccountSchema.findOne({ email: currentEmail, password: currentPassword })
        .then(async(doc) => {
            let foundPost = doc.posts.id(post)
            if (foundPost.authorId != doc._id) {
                res.json({ err: "Forbidden" }).status(403);
            }
            if (!foundPost) {
                res.json({ err: undefined });
            }
            else {
                doc.posts.pull(post)
                await doc.save()
                .then(res.json({ result: "Removed" }))
                .catch(e => console.error(e));
            }
        })
        .catch(e => console.error(e));
});

module.exports = router;