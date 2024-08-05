import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Product from "./../../../Database/Models/product.model.js";
import Order from "./../../../Database/Models/order.model.js";
import Review from "./../../../Database/Models/review.model.js";

// ========================================= create Review =========================================
export const createReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rate } = req.body;

  const productExist = await Product.findById(productId);

  if (!productExist) return next(new AppError("product is not found", 404));

  const order = await Order.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered",
  });

  if (!order)
    return next(
      new AppError("you aren't authorized to add review on this product", 404)
    );

  const review = new Review({
    comment,
    rate,
    productId,
    createdBy: req.user._id,
  });

  await review.save();

  if (!review._id) return next(new AppError("review is not created", 500));

  let sum = productExist.avgRate * productExist.RateNum;
  sum += review.rate;

  productExist.avgRate = sum / (productExist.RateNum + 1);
  productExist.RateNum += 1;
  await productExist.save();

  res.json({ message: "success", data: review });
});

// ========================================= update Review ==========================================
export const updateReview = asyncHandler(async (req, res, next) => {});

// ========================================= delete Review ==========================================
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    createdBy: req.user._id,
  });

  if (!review) return next(new AppError("review is not found", 404));

  const product = await Product.findById(review.productId);

  let sum = product.avgRate * product.RateNum;
  sum -= review.rate;
  product.avgRate = sum / (product.RateNum - 1);
  product.RateNum -= 1;
  await product.save();

  res.json({ message: "success" });
});

// ===================================== get All Reviews  ======================================
export const getAllReviews = asyncHandler(async (req, res, next) => {});
