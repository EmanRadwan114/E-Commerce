import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createOrderSchema = {
  body: Joi.object({}),
  headers: commonFields.headers.required(),
};
