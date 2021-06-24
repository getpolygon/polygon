const multer = require("multer");
const Express = require("express");
const storage = multer.memoryStorage({
  /**
   *
   * @param {Express.Request} _req
   * @param {multer.FileFilterCallback} callback
   */
  destination: (_req, _file, callback) => {
    callback(null, "");
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
