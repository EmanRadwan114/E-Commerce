import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import multerMiddleware from "./../../middlewares/multer.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import {
  createSubCategSchema,
  deleteSubCategSchema,
  getAllSubCategsSchema,
  getSubCategByIdSchema,
  getUserSubCategsSchema,
  updateSubCategSchema,
} from "./subCategory.validation.js";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategById,
  getUserSubCategories,
  updateSubCategory,
} from "./subCategory.controllers.js";
import systemRoles from "../../utils/systemRoles.js";

const subCategoryRouter = Router({ mergeParams: true });

// ============ create subCategory & get All SubCategories with their related categories ========
subCategoryRouter
  .route("/")
  .post(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(createSubCategSchema),
    createSubCategory
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllSubCategsSchema),
    getAllSubCategories
  );

// ================================ get user subCategories ======================================
subCategoryRouter.get(
  "/user",
  auth([
    Object.values(systemRoles).admin,
    Object.values(systemRoles).superAdmin,
  ]),
  validation(getUserSubCategsSchema),
  getUserSubCategories
);

// ============================ update, delete and get subCategory =============================
subCategoryRouter
  .route("/:subCategoryId")
  .get(
    auth(Object.values(systemRoles)),
    validation(getSubCategByIdSchema),
    getSubCategById
  )
  .put(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(updateSubCategSchema),
    updateSubCategory
  )
  .delete(
    auth([
      Object.values(systemRoles).admin,
      Object.values(systemRoles).superAdmin,
    ]),
    validation(deleteSubCategSchema),
    deleteSubCategory
  );

export default subCategoryRouter;
