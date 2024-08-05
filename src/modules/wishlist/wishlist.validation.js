import Joi from "joi";
import commonFields from "../../utils/validation/commonFieldsVal.js";

export const createWishlistSchema = {
  params: Joi.object({
    productId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const deleteWishlistSchema = {
  params: Joi.object({
    productId: commonFields.id.required(),
    wishlistId: commonFields.id.required(),
  }),
  headers: commonFields.headers.required(),
};

export const getWishlistsSchema = {
  headers: commonFields.headers.required(),
};
