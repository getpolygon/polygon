/**
 * A simple function for checking URL validity
 *
 * @param url - URL to check
 */
export const isUri = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_: any) {
    return false;
  }
};
