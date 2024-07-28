import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./category.controllers.js";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createCategSchema,
  deleteCategSchema,
  updateCategSchema,
} from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import systemRoles from "../../utils/systemRoles.js";

const categoryRouter = Router();

// ============================ create sub-category by merging params ===========================
categoryRouter.use("/:categoryId/sub-categories", subCategoryRouter);

// ========================================= create category =========================================
categoryRouter.post(
  "/",
  auth(["admin", "superAdmin"]),
  multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  validation(createCategSchema),
  createCategory
);

// ==================== get All Categories with their related subCategories ====================
categoryRouter.get("/", auth(Object.values(systemRoles)), getAllCategories);

// ========================================= update category =========================================
categoryRouter.put(
  "/:categoryId",
  auth(["admin", "superAdmin"]),
  multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  validation(updateCategSchema),
  updateCategory
);

// ========================================= delete category ==========================================
categoryRouter.delete(
  "/:categoryId",
  auth(["admin", "superAdmin"]),
  validation(deleteCategSchema),
  deleteCategory
);

export default categoryRouter;
