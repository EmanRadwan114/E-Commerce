import slugify from "slugify";
import { nanoid } from "nanoid";
import cloudinary from "./../../utils/cloudinary/cloudinary.js";
import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Category from "./../../../Database/Models/category.model.js";
import SubCategory from "./../../../Database/Models/subCategory.model.js";
import Brand from "../../../Database/Models/brand.model.js";
import Product from "../../../Database/Models/product.model.js";

// ========================================= create product =========================================
export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    price,
    discount,
    category,
    subCategory,
    brand,
    stock,
  } = req.body;

  const categoryExist = await Category.findById(category);
  if (!categoryExist) return next(new AppError("category not found", 404));

  const subCategoryExist = await SubCategory.findById(subCategory);
  if (!subCategoryExist)
    return next(new AppError("subCategory not found", 404));

  const brandExist = await Brand.findById(brand);
  if (!brandExist) return next(new AppError("brand not found", 404));

  const product = await Product.findOne({ title: title.toLowerCase() });
  if (product) return next(new AppError("product already exist", 404));

  const finalPrice = price - price * ((discount || 0) / 100);

  const folderId = nanoid(5);

  let coverImgs = [];
  req.files.images.forEach(async (img) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      img.path,
      {
        folder: `E-Commerce_NodeC42/categories/${categoryExist.folderId}/subCategories/${subCategoryExist.folderId}/products/${folderId}/coverImages`,
      }
    );
    coverImgs.push({ secure_url, public_id });
  });

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `E-Commerce_NodeC42/categories/${categoryExist.folderId}/subCategories/${subCategoryExist.folderId}/products/${folderId}`,
    }
  );

  const newProduct = new Product({
    title: title.toLowerCase(),
    description,
    price,
    discount,
    category,
    subCategory,
    brand,
    stock,
    finalPrice,
    slug: slugify(title, {
      replacement: "-",
      lower: true,
    }),
    image: { secure_url, public_id },
    coverImages: coverImgs,
    createdBy: req.user._id,
    folderId,
  });

  if (!newProduct) return next(new AppError("product is not created", 404));

  await newProduct.save();

  res.status(201).json({ message: "success", data: newProduct });
});

// ========================================= update product ==========================================
export const updateProduct = asyncHandler(async (req, res, next) => {
  const {
    stock,
    discount,
    category,
    subCategory,
    brand,
    price,
    title,
    description,
  } = req.body;
  const { productId } = req.params;

  let categoryExist, subCategoryExist;

  const product = await Product.findOne({
    _id: productId,
    createdBy: req.user._id,
  });
  if (!product) return next(new AppError("product not found", 404));

  if (category) {
    categoryExist = await Category.findById(category);
    if (!categoryExist) return next(new AppError("category not found", 404));
    product.category = category;
  }
  if (brand) {
    const brandExist = await Brand.findById(brand);
    if (!brandExist) return next(new AppError("brand not found", 404));
    product.brand = brand;
  }
  if (subCategory) {
    subCategoryExist = await SubCategory.findById(subCategory);
    if (!subCategoryExist)
      return next(new AppError("subCategory not found", 404));
    product.subCategory = subCategory;
  }

  if (title) {
    if (product.title === title.toLowerCase())
      return next(new AppError("product name should be different", 409));

    if (await Product.findOne({ title: title.toLowerCase() }))
      return next(new AppError("product name already exists", 409));

    product.title = title.toLowerCase();
    product.slug = slugify(title, {
      replacement: "-",
      lower: true,
    });
  }

  if (discount) {
    if (product.discount == discount)
      return next(new AppError("product discount should be different", 409));

    product.discount = discount;
    product.finalPrice = product.price - product.price * (discount / 100);
  }

  if (price) {
    if (product.price == price)
      return next(new AppError("product price should be different", 409));

    product.price = price;
  }

  if (description) {
    if (product.description === description)
      return next(new AppError("product description should be different", 409));

    product.description = description;
  }

  if (stock) {
    if (product.stock == stock)
      return next(new AppError("product stock should be different", 409));

    product.stock = stock;
  }

  if (req.files) {
    if (req.files.image) {
      await cloudinary.uploader.destroy(product.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `E-Commerce_NodeC42/categories/${categoryExist.folderId}/subCategories/${subCategoryExist.folderId}/products/${product.folderId}`,
        }
      );

      product.image = { secure_url, public_id };
    }

    if (req.files.images) {
      let coverImgs = [];

      req.files.images.forEach(async (img) => {
        product.coverImages.forEach(async (coverImg) => {
          await cloudinary.uploader.destroy(coverImg.public_id);
        });

        const { secure_url, public_id } = await cloudinary.uploader.upload(
          img.path,
          {
            folder: `E-Commerce_NodeC42/categories/${categoryExist.folderId}/subCategories/${subCategoryExist.folderId}/products/${product.folderId}/coverImages`,
          }
        );
        coverImgs.push({ secure_url, public_id });
      });
      product.coverImages = coverImgs;
    }
  }

  await product.save();

  res.json({ message: "success", data: product });
});

// ========================================= delete product ==========================================
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findOneAndDelete({
    _id: productId,
    createdBy: req.user._id,
  });

  if (!product) return next(new AppError("product not found", 404));

  res.json({ message: "success" });
});

// ===================================== get specific product by Id ======================================
export const getProductById = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    createdBy: req.user._id,
  })
    .populate([
      {
        path: "createdBy",
        select: "name -_id",
      },
      {
        path: "category",
        select: "name image -_id",
      },
      {
        path: "brand",
        select: "name image -_id",
      },
      {
        path: "subCategory",
        select: "name image -_id",
      },
    ])
    .select(
      "title description price discount stock finalPrice image coverImages -_id"
    );

  if (!product) return next(new AppError("product not found", 404));

  res.json({ message: "success", data: product });
});

// ===================================== get All products  ======================================
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({})
    .populate([
      {
        path: "createdBy",
        select: "name -_id",
      },
      {
        path: "category",
        select: "name image -_id",
      },
      {
        path: "brand",
        select: "name image -_id",
      },
      {
        path: "subCategory",
        select: "name image -_id",
      },
    ])
    .select(
      "title description price discount stock finalPrice image coverImages -_id"
    );

  if (!products) return next(new AppError("no products found", 404));

  res.json({ message: "success", data: products });
});

// ===================================== get All products for specific user ======================================
export const getUserProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ createdBy: req.user._id })
    .populate([
      {
        path: "category",
        select: "name image -_id",
      },
      {
        path: "brand",
        select: "name image -_id",
      },
      {
        path: "subCategory",
        select: "name image -_id",
      },
    ])
    .select(
      "title description price discount stock finalPrice image coverImages -_id"
    );

  if (!products) return next(new AppError("no products found", 404));

  res.json({ message: "success", data: products });
});
