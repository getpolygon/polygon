require("mongoose");

const { MINIO_HOST, MINIO_PORT, MINIO_ACCKEY, MINIO_SECKEY, MINIO_USESSL } = require("../minio.config");
const minio = require("minio");
const MinIOClient = new minio.Client({
    endPoint: MINIO_HOST,
    port: MINIO_PORT,
    accessKey: MINIO_ACCKEY,
    secretKey: MINIO_SECKEY,
    useSSL: MINIO_USESSL
})

const router = require("express").Router();

const AccountSchema = require("../models/account");

router.delete("/", async (req, res) => {
    let currentEmail = req.cookies.email;
    let currentPassword = req.cookies.password;
    let post = req.query.postId;

    await AccountSchema.findOne({ email: currentEmail, password: currentPassword })
        .then(async (doc) => {
            let foundPost = doc.posts.id(post);
            if (foundPost.attachedImage) {
                MinIOClient.removeObject('local', `${currentEmail}/media/${foundPost.attachedImageFileName}`, function (err) {
                    if (err) {
                        return console.log('Unable to remove object', err)
                    }
                });
                doc.posts.pull(foundPost)
                await doc.save()
                    .then(res.json({ result: "Removed" }))
                    .catch(e => console.error(e));
            } else {
                doc.posts.pull(foundPost)
                await doc.save()
                    .then(res.json({ result: "Removed" }))
                    .catch(e => console.error(e));
            }
        })
        .catch(e => console.error(e));
});

module.exports = router;