import { z } from "zod";
import { Segments, zodiac } from "./zodiac";

/**
 * Validates the UUID from a request
 *
 * @param fields - Fields to be validated
 * @param segment - Segments to be validated
 */
export const uuidValidator = (
  fields: string[] = ["id"],
  segment = Segments.PARAMS
) => {
  const pathParams: { [key: string]: unknown } = {};
  fields.map((field) => (pathParams[field] = z.string().uuid()));

  return zodiac({
    [segment]: pathParams,
  });
};
