import slugify from "slugify";
import { nanoid } from "nanoid";
import cloudinary from "./../../utils/cloudinary/cloudinary.js";
import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import SubCategory from "./../../../Database/Models/subCategory.model.js";
import Category from "./../../../Database/Models/category.model.js";
import AppError from "../../utils/error handling/AppError.js";

// ======================================== create sub-category ========================================
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new AppError("no categories found", 404));

  const subCategory = await SubCategory.findOne({ name: name.toLowerCase() });
  if (subCategory) return next(new AppError("subCategory already exists", 409));

  const folderId = nanoid(6);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce_NodeC42/categories/${category.folderId}/subCategories/${folderId}`,
    }
  );

  const newSubCategory = new SubCategory({
    name: name.toLowerCase(),
    slug: slugify(name, {
      replacement: "-",
      lower: true,
    }),
    createdBy: req.user._id,
    category: req.params.categoryId,
    image: {
      secure_url,
      public_id,
    },
    folderId,
  });

  newSubCategory.save();

  return res.status(201).json({
    message: "subCategory created successfully",
    subCategory: newSubCategory,
  });
});

// ========================================= update sub-category ==========================================
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const category = await Category.findOne({
    _id: categoryId,
    createdBy: req.user._id,
  });
  if (!category) return next(new AppError("category not found", 404));

  const subCategory = await SubCategory.findOne({
    _id: req.params.subCategoryId,
    category: categoryId,
    createdBy: req.user._id,
  });
  if (!subCategory) return next(new AppError("sub-category not found", 404));

  if (name) {
    if (name === subCategory.name)
      return next(new AppError("name should be different", 409));

    if (await SubCategory.findOne({ name: name.toLowerCase() }))
      return next(new AppError("sub-category already exists", 409));

    subCategory.name = name.toLowerCase();
    subCategory.slug = slugify(name, {
      replacement: "-",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce_NodeC42/categories/${category.folderId}/subCategories/${subCategory.folderId}`,
      }
    );
    subCategory.image = {
      secure_url,
      public_id,
    };
  }

  subCategory.save();

  return res.json({
    message: "sub-category updated successfully",
    subCategory,
  });
});

// ========================================= delete sub-category ==========================================
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({
    _id: categoryId,
    createdBy: req.user._id,
  });
  if (!category) return next(new AppError("category not found", 404));

  const subCategory = await SubCategory.findOneAndDelete({
    _id: req.params.subCategoryId,
    category: categoryId,
    createdBy: req.user._id,
  });

  if (!subCategory) return next(new AppError("sub-category not found", 404));

  await cloudinary.api.delete_resources_by_prefix(
    `E-Commerce_NodeC42/categories/${category.folderId}/subCategories/${subCategory.folderId}`
  );
  await cloudinary.api.delete_folder(
    `E-Commerce_NodeC42/categories/${category.folderId}/subCategories/${subCategory.folderId}`
  );

  res.json({ message: "sub-category deleted successfully" });
});

// ===================================== get specific sub-category by Id ======================================
export const getSubCategById = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({
    _id: categoryId,
    createdBy: req.user._id,
  });
  if (!category) return next(new AppError("category not found", 404));

  const subCategory = await SubCategory.find({
    _id: req.params.subCategoryId,
    category: categoryId,
    createdBy: req.user._id,
  })
    .populate([
      {
        path: "category",
        select: "name slug image -_id",
      },
      {
        path: "createdBy",
        select: "name -_id",
      },
    ])
    .select("name image slug -_id");

  if (!subCategory) return next(new AppError("no subCategory found", 404));

  res.json({ message: "subCategory fetched successfully", subCategory });
});

// ==================== get All SubCategories with their related categories ====================
export const getAllSubCategories = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) return next(new AppError("category not found", 404));

  const subCategories = await SubCategory.find()
    .populate([
      {
        path: "category",
        select: "name slug image -_id",
      },
      {
        path: "createdBy",
        select: "name -_id",
      },
    ])
    .select("name image slug -_id");
  if (!subCategories)
    return next(new AppError("no sub-categories found for this category", 404));

  res.json({ message: "sub-categories fetched successfully", subCategories });
});

// ===================================== get All subCategories for specific user ======================================
export const getUserSubCategories = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) return next(new AppError("category not found", 404));

  const subCategories = await SubCategory.find({ createdBy: req.user._id })
    .populate([
      {
        path: "category",
        select: "name slug image -_id",
      },
      {
        path: "createdBy",
        select: "name -_id",
      },
    ])
    .select("name image slug -_id");

  if (!subCategories) return next(new AppError("no subCategories found", 404));

  res.json({ message: "subCategories fetched successfully", subCategories });
});
