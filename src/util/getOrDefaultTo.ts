/**
 * Utility for defaulting to the right value if the left one is `null` or `undefined`
 */
const getOrDefaultTo = <L, R>(left: L, right: R): L | R => {
  if (!left) return right;
  return left;
};

export default getOrDefaultTo;
