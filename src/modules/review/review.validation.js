import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";
import Review from "../../../Database/Models/review.model.js";

export const createReviewSchema = {
  body: Joi.object({
    comment: Joi.string().min(3).required(),
    rate: Joi.number().min(1).max(5).required(),
  }),
  params: Joi.object({
    productId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const updateReviewSchema = {
  body: Joi.object({
    comment: Joi.string().min(3),
    rate: Joi.number().min(1).max(5),
  }),
  params: Joi.object({
    productId: commonFields.id.required(),
    reviewId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const deleteReviewSchema = {
  params: Joi.object({
    productId: commonFields.id.required(),
    reviewId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const getReviewsSchema = {
  headers: commonFields.headers.required(),
};
