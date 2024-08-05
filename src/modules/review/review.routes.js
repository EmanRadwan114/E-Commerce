import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "./review.controllers.js";
import {
  createReviewSchema,
  deleteReviewSchema,
  getReviewsSchema,
  updateReviewSchema,
} from "./review.validation.js";

const reviewRouter = Router({
  mergeParams: true,
});

// ========================== create & get reviews ===========================
reviewRouter
  .route("/")
  .post(auth([systemRoles.user]), validation(createReviewSchema), createReview)
  .get(
    auth(Object.values(systemRoles)),
    validation(getReviewsSchema),
    getAllReviews
  );

// ============================ update & delete review =============================
reviewRouter
  .route("/:reviewId")
  .put(auth([systemRoles.user]), validation(updateReviewSchema), updateReview)
  .delete(
    auth([systemRoles.user]),
    validation(deleteReviewSchema),
    deleteReview
  );

export default reviewRouter;
