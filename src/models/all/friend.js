const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Friend = new mongoose.Schema({
  /**
   * Friend types
   * -----------------------------
   * 0 - Pending
   * 1 - Requested
   * 2 - Friends
   * 3 - None
   * -----------------------------
   */
  type: { type: Number, required: true, default: 0 },
  timestamp: { type: Date, required: true, default: () => Date.now() },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
});

// Plugins
Friend.plugin(mongoosePaginate);

module.exports = mongoose.model("Friend", Friend);
