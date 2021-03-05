const _ = require("lodash");

/**
 *
 * @param {Object} obj
 * @param {Array} keys
 */
const omit = (obj, keys) => {
	return _.omit(JSON.parse(JSON.stringify(obj)), keys);
};

module.exports = omit;
