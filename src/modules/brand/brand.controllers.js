import slugify from "slugify";
import { nanoid } from "nanoid";
import cloudinary from "./../../utils/cloudinary/cloudinary.js";
import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Brand from "./../../../Database/Models/brand.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";

// ========================================= create brand =========================================
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brand = await Brand.findOne({ name: name.toLowerCase() });

  if (brand) return next(new AppError("brand already exists", 409));

  const folderId = nanoid(6);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce_NodeC42/brands/${folderId}`,
    }
  );

  req.filePath = `E-Commerce_NodeC42/brands/${folderId}`;

  const newBrand = new Brand({
    name: name.toLowerCase(),
    slug: slugify(name, {
      replacement: "-",
      lower: true,
    }),
    createdBy: req.user._id,
    image: {
      secure_url,
      public_id,
    },
    folderId,
  });

  await newBrand.save();

  req.data = {
    model: Brand,
    id: newBrand._id,
  };

  return res.status(201).json({
    message: "success",
    data: newBrand,
  });
});

// ========================================= update brand ==========================================
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { brandId } = req.params;

  const brand = await Brand.findOne({
    _id: brandId,
    createdBy: req.user._id,
  });
  if (!brand) return next(new AppError("brand not found", 404));

  if (name) {
    if (name.toLowerCase() === brand.name)
      return next(new AppError("name should be different", 409));

    if (await Brand.findOne({ name: name.toLowerCase() }))
      return next(new AppError("brand already exists", 409));

    brand.name = name.toLowerCase();
    brand.slug = slugify(name, {
      replacement: "-",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce_NodeC42/brands/${brand.folderId}`,
      }
    );

    brand.image = {
      secure_url,
      public_id,
    };
  }

  await brand.save();

  return res.json({ message: "success", data: brand });
});

// ========================================= delete brand ==========================================
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findOneAndDelete({
    _id: brandId,
    createdBy: req.user._id,
  });

  if (!brand) return next(new AppError("brand not found", 404));

  await cloudinary.api.delete_resources_by_prefix(
    `E-Commerce_NodeC42/brands/${brand.folderId}`
  );
  await cloudinary.api.delete_folder(
    `E-Commerce_NodeC42/brands/${brand.folderId}`
  );

  res.json({ message: "success" });
});

// ===================================== get specific brand by Id ======================================
export const getBrandById = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.find({ _id: brandId, createdBy: req.user._id });

  if (!brand) return next(new AppError("no brand found", 404));

  res.json({ message: "success", data: brand });
});

// ===================================== get All brands  ======================================
export const getAllBrands = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Brand.find().select("name slug image -_id"),
    req.query
  )
    .pagination()
    .filter()
    .sort()
    .select()
    .search();

  const brands = await apiFeatures.mongooseQuery;

  if (!brands) return next(new AppError("no brands found", 404));

  res.json({ message: "success", page: apiFeatures.page, data: brands });
});

// ===================================== get All brands for specific user ======================================
export const getUserBrands = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Brand.find({ createdBy: req.user._id }).select("name slug image -_id"),
    req.query
  )
    .pagination()
    .filter()
    .sort()
    .select()
    .search();

  const brands = await apiFeatures.mongooseQuery;

  if (!brands) return next(new AppError("no brands found", 404));

  res.json({ message: "success", page: apiFeatures.page, data: brands });
});
