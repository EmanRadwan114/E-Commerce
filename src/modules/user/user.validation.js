import Joi from "joi";
import commonFields from "./../../utils/validation/commonFieldsVal.js";

export const signupSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    age: Joi.number().required(),
    phone: Joi.array().items(Joi.string()),
    address: Joi.array().items(Joi.string()),
  }),
};

export const verifyEmailSchema = {
  params: Joi.object({
    token: Joi.string().required(),
  }),
};

export const refreshTokenSchema = {
  params: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

export const signinSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const forgetPassSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
  headers: commonFields.headers.required(),
};

export const resetPassSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    code: Joi.string().required(),
  }),
  headers: commonFields.headers.required(),
};
