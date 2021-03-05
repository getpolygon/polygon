const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: path.resolve("tmp"),
	filename: (_err, file, cb) => {
		cb(null, `${file.originalname}`);
	}
});
const upload = multer({ storage: storage });

module.exports = upload;
