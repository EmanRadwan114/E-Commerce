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
    image: Joi.array()
      .items(
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
      )
      .required(),

    images: Joi.array()
      .items(
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
      )
      .required(),
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
  }),
};

export default commonFields;
