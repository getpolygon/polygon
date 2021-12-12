import { celebrate, Joi, Segments } from "celebrate";

/**
 * small `celebrate` function for validating the `id` parameter of each request
 */
export const uuidValidator = (fields: string[] = ["id"]) => {
  const pathParams: any = {};
  fields.map((field) => (pathParams[field] = Joi.string().uuid().exist()));

  return celebrate({
    [Segments.PARAMS]: pathParams,
  });
};
