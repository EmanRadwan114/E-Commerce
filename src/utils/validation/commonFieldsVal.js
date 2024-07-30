import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helper) => {
  return mongoose.Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid id");
};

const commonFields = {
  id: Joi.string().custom(objectIdValidation),

  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
  }),

  files: Joi.object({
    image: Joi.array().items(
      Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required(),
      })
    ),
    coverImages: Joi.array().items(
      Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required(),
      })
    ),
  }),

  headers: Joi.object({
    token: Joi.string().required(),
    "cache-control": Joi.string(),
    "postman-token": Joi.string(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    "user-agent": Joi.string(),
    "accept-encoding": Joi.string(),
    host: Joi.string(),
    accept: Joi.string(),
    connection: Joi.string(),
    "x-forwarded-host": Joi.string(),
    "x-vercel-ip-country": Joi.string(),
    "x-vercel-ja4-digest": Joi.string(),
    "x-vercel-proxy-signature": Joi.string(),
    "x-vercel-proxied-for": Joi.string(),
    "x-forwarded-for": Joi.string(),
    "x-vercel-ip-as-number": Joi.string(),
    "x-vercel-ip-country-region": Joi.string(),
    "x-vercel-proxy-signature-ts": Joi.string(),
    "x-vercel-deployment-url": Joi.string(),
    "x-vercel-id": Joi.string(),
    "x-real-ip": Joi.string(),
    "x-vercel-ip-longitude": Joi.string(),
    "x-vercel-ip-latitude": Joi.string(),
    "x-forwarded-proto": Joi.string(),
    "x-vercel-forwarded-for": Joi.string(),
    forwarded: Joi.string(),
    "x-vercel-ip-city": Joi.string(),
    "x-vercel-ip-continent": Joi.string(),
    referer: Joi.string(),
    "x-vercel-ip-timezone": Joi.string(),
  }),
};

export default commonFields;
