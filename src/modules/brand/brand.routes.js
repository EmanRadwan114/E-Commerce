import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createBrandSchema,
  deleteBrandSchema,
  updateBrandSchema,
} from "./brand.validation.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "./brand.controllers.js";
import systemRoles from "./../../utils/systemRoles.js";

const brandRouter = Router();

// ========================================= create brand =========================================
brandRouter.post(
  "/",
  auth(["admin", "superAdmin"]),
  multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  validation(createBrandSchema),
  createBrand
);

// ======================================== get All brands =========================================
brandRouter.get("/", auth(Object.values(systemRoles)), getAllBrands);

// ========================================= update brand =========================================
brandRouter.put(
  "/:brandId",
  auth(["admin", "superAdmin"]),
  multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  validation(updateBrandSchema),
  updateBrand
);

// ========================================= delete brand ==========================================
brandRouter.delete(
  "/:brandId",
  auth(["admin", "superAdmin"]),
  validation(deleteBrandSchema),
  deleteBrand
);

export default brandRouter;
