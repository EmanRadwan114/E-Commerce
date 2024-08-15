import cloudinary from "../cloudinary/cloudinary.js";
import asyncHandler from "./asyncHandler.js";

export const deleteFromCloudinary = asyncHandler(async (req, res, next) => {
  if (req?.filePath) {
    await cloudinary.api.delete_resources_by_prefix(req.filePath);
    await cloudinary.api.delete_folder(req.filePath);
    next();
  }
});

export const deleteFromDB = asyncHandler(async (req, res, next) => {
  if (req?.data) {
    const { model, id } = req.data;
    await model.deleteOne({ _id: id });
  }
});
