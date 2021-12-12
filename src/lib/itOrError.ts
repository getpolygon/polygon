import { isNil } from "lodash";

/**
 * Helper function for throwing an error whenever the provided value is `null` or `undefined`
 *
 * @param value - Default value
 * @param error - Error if the value is `null` or `undefined`
 */
export const itOrError = (value: any, error: Error): any => {
  if (!isNil(value)) return value;
  else throw error;
};
