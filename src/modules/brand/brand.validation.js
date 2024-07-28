import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createBrandSchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file.required(),
};

export const updateBrandSchema = {
  body: Joi.object({
    name: Joi.string(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file,
  params: Joi.object({
    brandId: commonFields.id.required(),
  }),
};

export const deleteBrandSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    brandId: commonFields.id.required(),
  }),
};
