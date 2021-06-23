/**
 * A function for generating a avatar
 * URL to fetch from a remote API
 *
 * @param {String} firstName
 * @param {String} lastName
 * @returns {String}
 */
module.exports = (firstName, lastName) => {
  return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(
    `${firstName} ${lastName}`
  )}.svg`;
};
