import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getUserCategories,
  updateCategory,
} from "./category.controllers.js";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createCategSchema,
  deleteCategSchema,
  getAllCategsSchema,
  getCategByIdSchema,
  getUserCategsSchema,
  updateCategSchema,
} from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import systemRoles from "../../utils/systemRoles.js";

const categoryRouter = Router();

// ============================ create sub-category by merging params ===========================
categoryRouter.use("/:categoryId/sub-categories", subCategoryRouter);

// ========================== create category & get all categories ===========================
categoryRouter
  .route("/")
  .post(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(createCategSchema),
    createCategory
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllCategsSchema),
    getAllCategories
  );

// ================================ get user categories ======================================
categoryRouter.get(
  "/user",
  auth([
    Object.values(systemRoles).admin,
    Object.values(systemRoles).superAdmin,
  ]),
  validation(getUserCategsSchema),
  getUserCategories
);

// ============================ update, delete and get category =============================
categoryRouter
  .route("/:categoryId")
  .get(
    auth(Object.values(systemRoles)),
    validation(getCategByIdSchema),
    getCategoryById
  )
  .put(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(updateCategSchema),
    updateCategory
  )
  .delete(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    validation(deleteCategSchema),
    deleteCategory
  );

export default categoryRouter;
