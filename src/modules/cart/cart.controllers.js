import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Product from "./../../../Database/Models/product.model.js";
import Cart from "../../../Database/Models/cart.model.js";

// ========================================= add Product to cart =========================================
export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const productExist = await Product.findById({ _id: productId });

  if (!productExist)
    return next(new AppError("product not exist or out of stock", 404));

  let cartExist = await Cart.findOne({ user: req.user._id });

  if (!cartExist) {
    cartExist = new Cart({
      user: req.user._id,
      products: [
        {
          productId,
          quantity: 1,
        },
      ],
    });
    await cartExist.save();

    req.data = {
      model: Cart,
      id: cartExist._id,
    };
  } else {
    let flag = false;
    cartExist.products.map((product) => {
      if (product.productId.toString() === productId) {
        product.quantity += 1;
        flag = true;
      }
    });
    if (!flag) {
      cartExist.products.push({ productId, quantity: 1 });
    }
    await cartExist.save();
  }

  res.json({ message: "success", data: cartExist });
});

// ========================================= update cart ==========================================
export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const { cartExists } = req.cart;

  const productExist = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!productExist)
    return next(new AppError("product not exist or out of stock", 404));

  for (const product of cartExists.products) {
    if (product.productId.toString() === productId) {
      product.quantity = quantity;
    }
  }

  await cartExists.save();

  res.json({ message: "success", data: cartExists });
});

// ========================================= delete cart item ==========================================
export const deleteCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { cartExists } = req.cart;

  cartExists.products = cartExists.products.filter((product) => {
    return product.productId.toString() !== productId;
  });

  await cartExists.save();

  res.json({ message: "success", data: cartExists });
});

// ========================================= clear cart ==========================================
export const clearCart = asyncHandler(async (req, res, next) => {
  const { cartExists } = req.cart;

  cartExists.products = [];
  await cartExists.save();

  res.json({ message: "success", data: cartExists });
});

// ===================================== get All carts  ======================================
export const getAllCarts = asyncHandler(async (req, res, next) => {
  const carts = await Cart.find({});

  if (!carts) return next(new AppError("no carts found", 404));

  res.json({ message: "success", data: carts });
});

// ===================================== get user cart ======================================
export const getUserCart = asyncHandler(async (req, res, next) => {
  const { cartExists } = req.cart;

  res.json({ message: "success", data: cartExists });
});
