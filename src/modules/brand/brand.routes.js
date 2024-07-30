import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createBrandSchema,
  deleteBrandSchema,
  getAllBrandsSchema,
  getBrandByIdSchema,
  getUserBrandsSchema,
  updateBrandSchema,
} from "./brand.validation.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  getUserBrands,
  updateBrand,
} from "./brand.controllers.js";
import systemRoles from "./../../utils/systemRoles.js";

const brandRouter = Router();

// ========================== create brand & get all brands ===========================
brandRouter
  .route("/")
  .post(
    auth([systemRoles.admin, systemRoles.superAdmin]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(createBrandSchema),
    createBrand
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllBrandsSchema),
    getAllBrands
  );

// ================================ get user brands ======================================
brandRouter.get(
  "/user",
  auth([systemRoles.admin, systemRoles.superAdmin]),
  validation(getUserBrandsSchema),
  getUserBrands
);

// ============================ update, delete and get brand =============================
brandRouter
  .route("/:brandId")
  .get(
    auth(Object.values(systemRoles)),
    validation(getBrandByIdSchema),
    getBrandById
  )
  .put(
    auth([systemRoles.admin, systemRoles.superAdmin]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(updateBrandSchema),
    updateBrand
  )
  .delete(
    auth([systemRoles.admin, systemRoles.superAdmin]),
    validation(deleteBrandSchema),
    deleteBrand
  );

export default brandRouter;
