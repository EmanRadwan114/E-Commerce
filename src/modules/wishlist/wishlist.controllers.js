import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Product from "./../../../Database/Models/product.model.js";
import WishList from "./../../../Database/Models/wishlist.model.js";

// ========================================= create brand =========================================
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

// ========================================= update Wishlist ==========================================
export const updateWishlist = asyncHandler(async (req, res, next) => {});

// ========================================= delete Wishlist ==========================================
export const deleteWishlist = asyncHandler(async (req, res, next) => {
  const { wishlistId, productId } = req.params;

  const wishlist = await WishList.findOneAndUpdate(
    {
      _id: wishlistId,
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
export const getWishlists = asyncHandler(async (req, res, next) => {});
