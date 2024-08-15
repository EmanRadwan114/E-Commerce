import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Product from "./../../../Database/Models/product.model.js";
import WishList from "./../../../Database/Models/wishlist.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";

// ========================================= create wishlist =========================================
export const createWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) return next(new AppError("product not found", 404));

  const wishlist = await WishList.findOne({ user: req.user._id });
  if (!wishlist) {
    const newWishlist = new WishList({
      user: req.user._id,
      products: [productId],
    });

    await newWishlist.save();

    req.data = {
      model: WishList,
      id: newWishlist._id,
    };

    return res.status(201).json({
      status: "success",
      data: newWishlist,
    });
  }

  const newWishlist = await WishList.findOneAndUpdate(
    { user: req.user._id },
    {
      $addToSet: {
        products: productId,
      },
    },
    {
      new: true,
    }
  );
  return res.status(201).json({
    status: "success",
    data: newWishlist,
  });
});

// ========================================= remove product from Wishlist ==========================================
export const deleteWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await WishList.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      $pull: {
        products: productId,
      },
    },
    {
      new: true,
    }
  );

  if (!wishlist) return next(new AppError("wishlist is not found", 404));

  res.json({ message: "success" });
});

// ===================================== get All Wishlists  ======================================
export const getWishlists = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    WishList.find({}).populate([
      {
        path: "user",
        select: "name -_id",
      },
      {
        path: "products",
        select: "title description -_id",
      },
    ]),
    req.query
  ).pagination();

  const wishlists = await apiFeatures.mongooseQuery;

  if (!wishlists) return next(new AppError("no wishlists found", 404));

  res.json({ message: "success", page: apiFeatures.page, data: wishlists });
});
