import AppError from "../utils/error handling/AppError.js";
import asyncHandler from "../utils/error handling/asyncHandler.js";
import Cart from "../../Database/Models/cart.model.js";

const checkCartAuthorization = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;

  const cartExists = await Cart.findOne(cartId);
  if (!cartExists) return next(new AppError("cart not found", 404));

  if (
    req.user._id !== cartExists.user &&
    req.user.role !== "admin" &&
    req.user.role !== "superAdmin"
  )
    return next(new AppError("you are unauthorized", 401));

  req.cart = cartExists;

  next();
});

export default checkCartAuthorization;
