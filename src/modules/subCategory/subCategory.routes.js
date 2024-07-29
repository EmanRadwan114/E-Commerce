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
    auth(["admin", "superAdmin"]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(createSubCategSchema),
    createSubCategory
  )
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllSubCategsSchema),
    getAllSubCategories
  );

// ================================ get user coupons ======================================
subCategoryRouter.get(
  "/user",
  auth(["admin", "superAdmin"]),
  validation(getUserSubCategsSchema),
  getUserSubCategories
);

// ============================ update, delete and get coupon =============================
subCategoryRouter
  .route("/:subCategoryId")
  .get(
    auth(Object.values(systemRoles)),
    validation(getSubCategByIdSchema),
    getSubCategById
  )
  .put(
    auth(["admin", "superAdmin"]),
    multerMiddleware(["image/png", "image/jpg", "image/jpeg"]).single("image"),
    validation(updateSubCategSchema),
    updateSubCategory
  )
  .delete(
    auth(["admin", "superAdmin"]),
    validation(deleteSubCategSchema),
    deleteSubCategory
  );

export default subCategoryRouter;
