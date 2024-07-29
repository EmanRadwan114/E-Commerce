import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createSubCategSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file.required(),
  params: Joi.object({
    categoryId: commonFields.id.required(),
  }),
};

export const updateSubCategSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50),
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

export const getSubCategByIdSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    categoryId: commonFields.id.required(),
    subCategoryId: commonFields.id.required(),
  }),
};

export const getUserSubCategsSchema = {
  headers: commonFields.headers.required(),
};

export const getAllSubCategsSchema = {
  headers: commonFields.headers.required(),
};
