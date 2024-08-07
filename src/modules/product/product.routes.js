import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import reviewRouter from "./../review/review.routes.js";
import wishlistRouter from "./../wishlist/wishlist.routes.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  updateProduct,
} from "./product.controllers.js";
import {
  createProductSchema,
  deleteProductSchema,
  getAllProductsSchema,
  getProductByIdSchema,
  getUserProductsSchema,
  updateProductSchema,
} from "./product.validation.js";

const productRouter = Router();

// ========================== create product & get all products ===========================
productRouter
  .route("/")
  .post(
    auth([systemRoles.admin, systemRoles.superAdmin]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).fields([
      { name: "image", maxCount: 1 },
      { name: "coverImages", maxCount: 5 },
    ]),
    validation(createProductSchema),
    createProduct
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllProductsSchema),
    getAllProducts
  );

// ================================ get user product ======================================
productRouter.get(
  "/user",
  auth([systemRoles.admin, systemRoles.superAdmin]),
  validation(getUserProductsSchema),
  getUserProducts
);

// ============================ update, delete and get product =============================
productRouter
  .route("/:productId")
  .get(
    auth(Object.values(systemRoles)),
    validation(getProductByIdSchema),
    getProductById
  )
  .put(
    auth([systemRoles.admin, systemRoles.superAdmin]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).fields([
      { name: "image", maxCount: 1 },
      { name: "coverImages", maxCount: 5 },
    ]),
    validation(updateProductSchema),
    updateProduct
  )
  .delete(
    auth([systemRoles.admin, systemRoles.superAdmin]),
    validation(deleteProductSchema),
    deleteProduct
  );

// =============================== merge params with review and wishlist =============================
productRouter.use("/:productId/reviews", reviewRouter);
productRouter.use("/:productId/wishlist", wishlistRouter);

export default productRouter;
