const multer = require("multer");
const storage = multer.memoryStorage({
	destination: (_req, _file, callback) => {
		callback(null, "");
	}
});
const upload = multer({ storage: storage });

module.exports = upload;
