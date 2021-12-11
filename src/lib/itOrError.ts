import { isNil } from "lodash";

export const itOrError = (value: any, error: Error) => {
  if (!isNil(value)) return value;
  else throw error;
};
