const mongoose = require("mongoose");
const AccountSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    bio: { type: String, required: false },
    pictureUrl: { type: String, required: true },
    private: { type: Boolean, required: true },
    date: { type: String, required: true }
})

module.exports = mongoose.model("Account", AccountSchema);
