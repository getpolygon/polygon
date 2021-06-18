const BW = require("bad-words");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });

const clean = (text = "") => sanitizeHtml(BadWordsFilter.clean(text));

module.exports = clean;
