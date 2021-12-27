import { celebrate, Joi, Segments } from "celebrate";

/**
 * Validates the UUID from a request.
 * 
 * @param fields - Fields to be validated
 * @param segments - Segments to be validated
 */
export const uuidValidator = (
  fields: string[] = ["id"],
  segments = Segments.PARAMS
) => {
  const pathParams: any = {};
  fields.map((field) => (pathParams[field] = Joi.string().uuid().exist()));

  return celebrate({
    [segments]: pathParams,
  });
};
