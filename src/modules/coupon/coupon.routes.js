import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createCouponSchema,
  deleteCouponSchema,
  getAllCouponsSchema,
  getCouponByIdSchema,
  getUserCouponsSchema,
  updateCouponSchema,
} from "./coupon.validation.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  getUserCoupons,
  updateCoupon,
} from "./coupon.controllers.js";
import systemRoles from "../../utils/systemRoles.js";

const couponRouter = Router();

// ========================== create coupon & get all coupons ===========================
couponRouter
  .route("/")
  .post(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    validation(createCouponSchema),
    createCoupon
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllCouponsSchema),
    getAllCoupons
  );

// ================================ get user coupons ======================================
couponRouter.get(
  "/user",
  auth([
    Object.values(systemRoles).admin,
    Object.values(systemRoles).superAdmin,
  ]),
  validation(getUserCouponsSchema),
  getUserCoupons
);

// ============================ update, delete and get coupon =============================
couponRouter
  .route("/:couponId")
  .get(
    auth(Object.values(systemRoles)),
    validation(getCouponByIdSchema),
    getCouponById
  )
  .put(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    validation(updateCouponSchema),
    updateCoupon
  )
  .delete(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    validation(deleteCouponSchema),
    deleteCoupon
  );

export default couponRouter;
