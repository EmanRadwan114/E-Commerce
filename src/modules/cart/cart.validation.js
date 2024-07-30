import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const addProductToCartSchema = {
  body: Joi.object({
    productId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const updateCartSchema = {
  body: Joi.object({
    quantity: Joi.number().min(1).required(),
  }),
  headers: commonFields.headers.required(),
  params: Joi.object({
    cartId: commonFields.id.required(),
    productId: commonFields.id.required(),
  }),
};

export const deleteCartItemSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    cartId: commonFields.id.required(),
    productId: commonFields.id.required(),
  }),
};

export const clearCartSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    cartId: commonFields.id.required(),
  }),
};

export const getUserCartSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    cartId: commonFields.id.required(),
  }),
};

export const getAllCartsSchema = {
  headers: commonFields.headers.required(),
};
