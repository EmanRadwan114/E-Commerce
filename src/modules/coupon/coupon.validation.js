import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createCouponSchema = {
  body: Joi.object({
    code: Joi.string().min(3).max(50).required(),
    amount: Joi.number().min(1).max(100).integer().required(),
    fromDate: Joi.date().greater(Date.now()).required(),
    expiryDate: Joi.date().greater(Joi.ref("fromDate")).required(),
  }),
  headers: commonFields.headers.required(),
};

export const updateCouponSchema = {
  body: Joi.object({
    code: Joi.string().min(3).max(50),
    amount: Joi.number().min(1).max(100).integer(),
    fromDate: Joi.date().greater(Date.now()),
    expiryDate: Joi.date().greater(Joi.ref("fromDate")),
  }),
  headers: commonFields.headers.required(),
  params: Joi.object({
    couponId: commonFields.id.required(),
  }),
};

export const deleteCouponSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    couponId: commonFields.id.required(),
  }),
};

export const getCouponByIdSchema = {
  headers: commonFields.headers.required(),
  params: Joi.object({
    couponId: commonFields.id.required(),
  }),
};

export const getUserCouponsSchema = {
  headers: commonFields.headers.required(),
};

export const getAllCouponsSchema = {
  headers: commonFields.headers.required(),
};
