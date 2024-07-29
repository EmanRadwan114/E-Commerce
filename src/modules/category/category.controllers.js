import slugify from "slugify";
import { nanoid } from "nanoid";
import Category from "../../../Database/Models/category.model.js";
import cloudinary from "./../../utils/cloudinary/cloudinary.js";
import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import SubCategory from "../../../Database/Models/subCategory.model.js";

// ========================================= create category =========================================
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.findOne({ name: name.toLowerCase() });

  if (category) return next(new AppError("category already exists", 409));

  const folderId = nanoid(6);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce_NodeC42/categories/${folderId}`,
    }
  );

  const newCategory = new Category({
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

  newCategory.save();

  return res.status(201).json({
    message: "category created successfully",
    category: newCategory,
  });
});

// ========================================= update category ==========================================
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const category = await Category.findOne({
    _id: categoryId,
    createdBy: req.user._id,
  });
  if (!category) return next(new AppError("category not found", 404));

  if (name) {
    if (name === category.name)
      return next(new AppError("name should be different", 409));

    if (await Category.findOne({ name: name.toLowerCase() }))
      return next(new AppError("category already exists", 409));

    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "-",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce_NodeC42/categories/${category.folderId}`,
      }
    );
    category.image = {
      secure_url,
      public_id,
    };
  }

  category.save();

  return res.json({ message: "category updated successfully", category });
});

// ========================================= delete category ==========================================
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findOneAndDelete({
    _id: categoryId,
    createdBy: req.user._id,
  });

  if (!category) return next(new AppError("category not found", 404));

  await SubCategory.deleteMany({ category: categoryId });

  await cloudinary.api.delete_resources_by_prefix(
    `E-Commerce_NodeC42/categories/${category.folderId}`
  );
  await cloudinary.api.delete_folder(
    `E-Commerce_NodeC42/categories/${category.folderId}`
  );

  res.json({ message: "category deleted successfully" });
});

// ===================================== get specific category by Id ======================================
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.find({
    _id: categoryId,
    createdBy: req.user._id,
  });

  if (!category) return next(new AppError("no category found", 404));

  res.json({ message: "category fetched successfully", category });
});

// ==================== get All categories with their related sub-categories ====================
export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate([
    {
      path: "subCategories",
      select: "name slug image -_id -category",
    },
    {
      path: "createdBy",
      select: "name -_id",
    },
  ]);

  if (!categories)
    return next(new AppError("no categories found for this category", 404));

  res.json({ message: "categories fetched successfully", categories });
});

// ===================================== get All categories for specific user ======================================
export const getUserCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ createdBy: req.user._id });

  if (!categories) return next(new AppError("no categories found", 404));

  res.json({ message: "categories fetched successfully", categories });
});
