import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createCategSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required(),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file.required(),
};

export const updateCategSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(50),
  }),
  headers: commonFields.headers.required(),
  file: commonFields.file,
  params: Joi.object({
    categoryId: commonFields.id.required(),
  }),
};

export const deleteCategSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    categoryId: commonFields.id.required(),
  }),
};

export const getCategByIdSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    categoryId: commonFields.id.required(),
  }),
};

export const getUserCategsSchema = {
  headers: commonFields.headers.required(),
};

export const getAllCategsSchema = {
  headers: commonFields.headers.required(),
};
