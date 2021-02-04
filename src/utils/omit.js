/**
 *
 * @param {Object} obj
 * @param {Array} keys
 */
const _ = require("lodash");

const omit = (obj, keys) => {
  return _.omit(JSON.parse(JSON.stringify(obj)), keys);
};

module.exports = omit;
