const _ = require("lodash");
const safeStringify = require("fast-safe-stringify").default;

const omit = (obj, keys) => {
	return _.omit(JSON.parse(safeStringify(obj)), keys);
};

module.exports = omit;
