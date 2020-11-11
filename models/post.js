const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
    authorEmail: { type: String, required: true },
    authorId: { type: String, required: true },
    authorImage: { type: String, required: true },
    attachedImage: { type: String },
    attachedImageFileName: { type: String },
    datefield: { type: String, required: true },
});
module.exports = PostSchema;