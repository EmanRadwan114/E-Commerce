import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createOrderSchema = {
  body: Joi.object({
    address: Joi.string().required(),
    phone: Joi.string().required(),
    paymentMethod: Joi.string().valid("cash", "card").required(),
    productId: commonFields.id,
    quantity: Joi.number().integer(),
    couponCode: Joi.string().min(3),
  }),
  headers: commonFields.headers.required(),
};

export const cancelOrderSchema = {
  body: Joi.object({
    reason: Joi.string().min(3),
  }),
  params: Joi.object({
    orderId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const getUserOrdersSchema = {
  headers: commonFields.headers.required(),
};

export const getAllOrdersSchema = {
  headers: commonFields.headers.required(),
};
