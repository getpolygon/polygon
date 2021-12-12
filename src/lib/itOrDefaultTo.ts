import { isNil } from "lodash";

/**
 * Helper function for defaulting to fallback value if the provided value is `null` or `undefined`
 *
 * @param it - Default value
 * @param fallback - Fallback value
 */
export const itOrDefaultTo = (it: any, fallback: any): any => {
  if (isNil(it)) return fallback;
  else return it;
};
