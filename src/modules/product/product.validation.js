import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createProductSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).required(),
    price: Joi.number().min(1).required(),
    discount: Joi.number().min(1).max(100),
    stock: Joi.number().min(1).integer().required(),
    category: commonFields.id.required(),
    subCategory: commonFields.id.required(),
    brand: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
  files: commonFields.files.required(),
};

export const updateProductSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(3),
    price: Joi.number().min(1),
    discount: Joi.number().min(1).max(100),
    stock: Joi.number().integer(),
    category: commonFields.id,
    subCategory: commonFields.id,
    brand: commonFields.id,
  }),
  headers: commonFields.headers.required(),
  files: commonFields.files,
  params: Joi.object({
    productId: commonFields.id.required(),
  }),
};

export const deleteProductSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    productId: commonFields.id.required(),
  }),
};

export const getProductByIdSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    productId: commonFields.id.required(),
  }),
};

export const getUserProductsSchema = {
  headers: commonFields.headers.required(),
};

export const getAllProductsSchema = {
  headers: commonFields.headers.required(),
};
