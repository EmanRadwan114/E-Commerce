import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createSubCategSchema,
  deleteSubCategSchema,
  updateSubCategSchema,
} from "./subCategory.validation.js";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  updateSubCategory,
} from "./subCategory.controllers.js";
import systemRoles from "../../utils/systemRoles.js";

const subCategoryRouter = Router({ mergeParams: true });

// ========================================= create sub-category =========================================
subCategoryRouter.post(
  "/",
  auth(["admin", "superAdmin"]),
  multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  validation(createSubCategSchema),
  createSubCategory
);

// ==================== get All SubCategories with their related categories ====================
subCategoryRouter.get(
  "/",
  auth(Object.values(systemRoles)),
  getAllSubCategories
);

// ========================================= update sub-category =========================================
subCategoryRouter.put(
  "/:subCategoryId",
  auth(["admin", "superAdmin"]),
  multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  validation(updateSubCategSchema),
  updateSubCategory
);

// ========================================= delete sub-category ==========================================
subCategoryRouter.delete(
  "/:subCategoryId",
  auth(["admin", "superAdmin"]),
  validation(deleteSubCategSchema),
  deleteSubCategory
);

export default subCategoryRouter;
