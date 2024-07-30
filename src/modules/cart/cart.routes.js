import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import {
  addProductToCart,
  clearCart,
  deleteCartItem,
  getAllCarts,
  getUserCart,
  updateCart,
} from "./cart.controllers.js";
import {
  addProductToCartSchema,
  clearCartSchema,
  deleteCartItemSchema,
  getAllCartsSchema,
  getUserCartSchema,
  updateCartSchema,
} from "./cart.validation.js";
import checkCartAuthorization from "../../middlewares/checkCartAuth.middleware.js";

const cartRouter = Router();

/* admin, superAdmin and cart user can update cart, delete cart Item & clear the cart 
that's why we created a checkCartAuthorization middleware.

in the middleware we accept cartId from params & check that cart cannot be updated, cleared or its item 
deleted by users except the cart owner, system admin & system superAdmin.

we also returned user cart in req.cart key
*/

// ========================== add product to cart & get carts ===========================
cartRouter
  .route("/")
  .post(
    auth([Object.values(systemRoles).user]),
    validation(addProductToCartSchema),
    addProductToCart
  )
  .get(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    validation(getAllCartsSchema),
    getAllCarts
  );

// ================================ get user cart ======================================
cartRouter.get(
  "/user/:cartId",
  auth(Object.values(systemRoles)),
  checkCartAuthorization,
  validation(getUserCartSchema),
  getUserCart
);

// ================================ clear cart ======================================
cartRouter.delete(
  "/:cartId",
  auth(Object.values(systemRoles)),
  checkCartAuthorization,
  validation(clearCartSchema),
  clearCart
);

// =========================== update & delete cart items ==========================================
cartRouter
  .route("/:cartId/:productId")
  .put(
    auth(Object.values(systemRoles)),
    checkCartAuthorization,
    validation(updateCartSchema),
    updateCart
  )
  .delete(
    auth(Object.values(systemRoles)),
    checkCartAuthorization,
    validation(deleteCartItemSchema),
    deleteCartItem
  );

export default cartRouter;
