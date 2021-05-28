module.exports = (firstName, lastName) => {
  return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(
    `${firstName} ${lastName}`
  )}.svg`;
};
