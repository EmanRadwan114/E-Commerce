import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import {
  createWishlist,
  deleteWishlist,
  getWishlists,
} from "./wishlist.controllers.js";
import {
  createWishlistSchema,
  deleteWishlistSchema,
  getWishlistsSchema,
} from "./wishlist.validation.js";

const wishlistRouter = Router({ mergeParams: true });

// ============================ create & get review =============================
wishlistRouter
  .route("/")
  .post(
    auth([systemRoles.user]),
    validation(createWishlistSchema),
    createWishlist
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getWishlistsSchema),
    getWishlists
  )
  .delete(
    auth([systemRoles.user]),
    validation(deleteWishlistSchema),
    deleteWishlist
  );

export default wishlistRouter;
