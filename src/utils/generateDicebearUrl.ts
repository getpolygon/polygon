export default (firstName: string, lastName: string) => {
  return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(
    `${firstName} ${lastName}`
  )}.svg`;
};
