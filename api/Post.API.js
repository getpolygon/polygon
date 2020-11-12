// For deleting files
const { unlink } = require("fs");
// For displaying dates
const { 
    fromUnixTime,
    format
} = require("date-fns");
// MinIO Configuration
const { 
    MINIO_HOST, 
    MINIO_PORT, 
    MINIO_ACCKEY, 
    MINIO_SECKEY, 
    MINIO_USESSL 
} = require("../minio.config");

const minio =       require("minio");
const MinIOClient = new minio.Client({
    endPoint:   MINIO_HOST,
    port:       MINIO_PORT,
    accessKey:  MINIO_ACCKEY,
    secretKey:  MINIO_SECKEY,
    useSSL:     MINIO_USESSL
})
const multer =  require("multer");
const storage = multer.diskStorage({
    destination: "tmp/",
    filename: (err, file, cb) => {
        cb(null, `${file.originalname.toString()}`);
        if (err) console.error(err);
    }
});
const upload =          multer({ storage: storage });
const router =          require("express").Router();
const AccountSchema =   require("../models/account");

// For fetching posts
router.get("/fetch", async (req, res) => {
    const currentAccount = await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password });
    let { accountId } = req.query;

    if (!accountId) {
        await AccountSchema
            .find({ isPrivate: false }) // Getting posts from all the public accounts
            .where("_id")               // These lines exclude current account from the query
            .ne(currentAccount._id)     // These lines exclude current account from the query
            .then((doc) => {
                let foundPosts = [];
                doc.forEach(account => {
                    account.posts.forEach(post => {
                        post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
                        foundPosts.push(post);
                    })
                });
                /* 
                 * Instead finding users' posts here
                 * Doing this because users' account could be private
                 * By doing this they'll be able to see their posts
                 */
                currentAccount.posts.forEach(post => {
                    post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
                    foundPosts.push(post);
                });
                res.json(foundPosts);
            })
            .catch((e) => console.log(e));
    }
    if (accountId) {
        await AccountSchema
            .findById(accountId)
            .then((doc) => {
                let foundPosts = [];
                doc.posts.forEach(post => {
                    post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
                    foundPosts.push(post);
                });
                res.json(foundPosts);
            })
            .catch(e => console.error(e));
    };
});

// For creating post
router.put("/create", upload.single("image"), async (req, res) => {
    let authorAccount = await AccountSchema.findOne({
        email:      req.cookies.email,
        password:   req.cookies.password,
    });
    let author =        authorAccount.fullName;
    let authorImage =   authorAccount.pictureUrl;
    let authorId =      authorAccount._id;

    if (req.file) {
        // Upload user image to the database
        await MinIOClient.fPutObject("local", `${authorAccount.email}/media/${req.file.originalname}`, req.file.path, { "Content-Type": req.file.mimetype });
        // Getting the link for the user's image
        const presignedUrl = await MinIOClient.presignedGetObject("local", `${authorAccount.email}/media/${req.file.originalname}`, 24 * 60 * 60);

        const Post = {
            text:                   req.body.text,
            author:                 author,
            authorEmail:            req.cookies.email,
            authorId:               authorId,
            authorImage:            authorImage,
            attachedImage:          presignedUrl,
            attachedImageFileName:  req.file.originalname.toString(),
            datefield:              Date.now(),
        };

        authorAccount.posts.push(Post);
        let post = authorAccount.posts.create(Post);

        await authorAccount
            .save()
            .then(() => {
                post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
                res.json(post);
                // Deleting the file from the drive
                unlink(`tmp/${req.file.originalname.toString()}`, (err) => {
                    if (err) console.error(err);
                });
            })
            .catch(e => console.error(e));
    } else {

        const Post = {
            text:           req.body.text,
            author:         author,
            authorEmail:    req.cookies.email,
            authorId:       authorId,
            authorImage:    authorImage,
            datefield:      Date.now(),
        };

        authorAccount.posts.push(Post);
        let post = authorAccount.posts.create(Post);

        await authorAccount
            .save()
            .then(() => {
                post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
                res.json(post)
            })
            .catch(e => console.error(e));
    }
});

// For deleting post
router.delete("/delete", async (req, res) => {
    let currentEmail = req.cookies.email;
    let currentPassword = req.cookies.password;
    let { post } = req.query;

    await AccountSchema.findOne({ email: currentEmail, password: currentPassword })
        .then(async (doc) => {
            let foundPost = doc.posts.id(post);
            if (foundPost.attachedImage) {
                MinIOClient.removeObject('local', `${currentEmail}/media/${foundPost.attachedImageFileName}`, function (err) {
                    if (err) {
                        return console.log('Unable to remove object', err);
                    };
                });
                doc.posts.pull(foundPost);
                await doc.save()
                    .then(res.json({ result: "Removed" }))
                    .catch(e => console.error(e));
            } else {
                doc.posts.pull(foundPost)
                await doc.save()
                    .then(res.json({ result: "Removed" }))
                    .catch(e => console.error(e));
            };
        })
        .catch(e => console.error(e));
});

module.exports = router;