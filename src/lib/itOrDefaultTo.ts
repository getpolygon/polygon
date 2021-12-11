import { isNil } from "lodash";

export const itOrDefaultTo = (it: any, fallback: any) => {
  if (isNil(it)) return fallback;
  else return it;
};
