import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Coupon from "./../../../Database/Models/coupon.model.js";

// ========================================= create coupon =========================================
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, expiryDate } = req.body;

  const coupon = Coupon.findOne({ code });

  if (coupon) return next(new AppError("coupon already exists", 409));

  const newCoupon = new Coupon({
    code,
    amount,
    fromDate,
    expiryDate,
    createdBy: req.user._id,
  });

  await newCoupon.save();

  if (!newCoupon) return next(new AppError("coupon not created", 500));

  res.status(201).json({
    message: "coupon created successfully",
    data: newCoupon,
  });
});

// ========================================= update coupon ==========================================
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findOneAndUpdate(
    { _id: couponId, createdBy: req.user._id },
    { ...req.body },
    { new: true }
  );

  if (!coupon) return next(new AppError("coupon not found", 404));

  res.json({ message: "coupon updated successfully", coupon });
});

// ========================================= delete coupon ==========================================
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findOneAndDelete({
    _id: couponId,
    createdBy: req.user._id,
  });

  if (!coupon) return next(new AppError("coupon not found", 404));

  res.json({ message: "coupon deleted successfully" });
});

// ===================================== get specific coupon by Id ======================================
export const getCouponById = asyncHandler(async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.find({ _id: couponId, createdBy: req.user._id });

  if (!coupon) return next(new AppError("no coupon found", 404));

  res.json({ message: "coupon fetched successfully", coupon });
});

// ===================================== get All coupons ======================================
export const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new AppError("no coupons found", 404));

  res.json({ message: "coupons fetched successfully", coupons });
});

// ===================================== get All coupons for specific user ======================================
export const getUserCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({ createdBy: req.user._id });

  if (!coupons) return next(new AppError("no coupons found", 404));

  res.json({ message: "coupons fetched successfully", coupons });
});
