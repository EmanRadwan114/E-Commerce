import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Coupon from "./../../../Database/Models/coupon.model.js";

// ========================================= create coupon =========================================
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, expiryDate } = req.body;

  const coupon = await Coupon.findOne({ code: code.toLowerCase() });

  if (coupon) return next(new AppError("coupon already exists", 409));

  const newCoupon = new Coupon({
    code: code.toLowerCase(),
    amount,
    fromDate,
    expiryDate,
    createdBy: req.user._id,
  });

  await newCoupon.save();

  if (!newCoupon) return next(new AppError("coupon not created", 500));

  res.status(201).json({
    message: "success",
    data: newCoupon,
  });
});

// ========================================= update coupon ==========================================
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { couponId } = req.params;
  const { code } = req.body;

  const couponExist = await Coupon.findOne({
    _id: couponId,
    createdBy: req.user._id,
  });
  if (!couponExist) return next(new AppError("coupon not found", 404));

  if (code) {
    if (code.toLowerCase() === couponExist.code)
      return next(new AppError("coupon code should be different", 409));

    if (await Coupon.findOne({ code: code.toLowerCase() }))
      return next(new AppError("coupon already exists", 409));

    couponExist.code = code.toLowerCase();
  }

  if (req.body.expiryDate) couponExist.expiryDate = req.body.expiryDate;

  if (req.body.fromDate) couponExist.fromDate = req.body.fromDate;

  await couponExist.save();

  res.json({ message: "success", data: couponExist });
});

// ========================================= delete coupon ==========================================
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findOneAndDelete({
    _id: couponId,
    createdBy: req.user._id,
  });

  if (!coupon) return next(new AppError("coupon not found", 404));

  res.json({ message: "success" });
});

// ===================================== get specific coupon by Id ======================================
export const getCouponById = asyncHandler(async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.find({ _id: couponId, createdBy: req.user._id });

  if (!coupon) return next(new AppError("no coupon found", 404));

  res.json({ message: "success", data: coupon });
});

// ===================================== get All coupons ======================================
export const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new AppError("no coupons found", 404));

  res.json({ message: "success", data: coupons });
});

// ===================================== get All coupons for specific user ======================================
export const getUserCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({ createdBy: req.user._id });

  if (!coupons) return next(new AppError("no coupons found", 404));

  res.json({ message: "success", data: coupons });
});
