import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createBrandSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file.required(),
};

export const updateBrandSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50),
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

export const getBrandByIdSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    brandId: commonFields.id.required(),
  }),
};

export const getUserBrandsSchema = {
  headers: commonFields.headers.required(),
};

export const getAllBrandsSchema = {
  headers: commonFields.headers.required(),
};
