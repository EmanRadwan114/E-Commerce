import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createSubCategSchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file,
  params: Joi.object({
    categoryId: commonFields.id.required(),
  }),
};

export const updateSubCategSchema = {
  body: Joi.object({
    name: Joi.string(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file,
  params: Joi.object({
    categoryId: commonFields.id.required(),
    subCategoryId: commonFields.id.required(),
  }),
};

export const deleteSubCategSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    categoryId: commonFields.id.required(),
    subCategoryId: commonFields.id.required(),
  }),
};
