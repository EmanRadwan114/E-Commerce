import AppError from "./error handling/AppError.js";
import globalErrHandler from "./error handling/globalErrHandler.js";
import userRouter from "./../modules/user/user.routes.js";
import categoryRouter from "../modules/category/category.routes.js";
import subCategoryRouter from "../modules/subCategory/subCategory.routes.js";
import brandRouter from "../modules/brand/brand.routes.js";
import couponRouter from "./../modules/coupon/coupon.routes.js";
import productRouter from "../modules/product/product.routes.js";
import cartRouter from "../modules/cart/cart.routes.js";
import orderRouter from "../modules/order/order.routes.js";
import reviewRouter from "../modules/review/review.routes.js";
import wishlistRouter from "../modules/wishlist/wishlist.routes.js";

export default function bootstrap(app, express) {
  const PORT = process.env.PORT || 3000;

  // =============================== body parser ===============================
  app.use(express.json());

  // ============================== routes ===============================
  app.use("/auth", userRouter);
  app.use("/categories", categoryRouter);
  app.use("/sub-categories", subCategoryRouter);
  app.use("/brands", brandRouter);
  app.use("/coupons", couponRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);
  app.use("/orders", orderRouter);
  app.use("/reviews", reviewRouter);
  app.use("/wishlist", wishlistRouter);

  // ============================== error handler ===============================
  app.use("*", (req, res, next) => {
    return next(new AppError(`page not found at ${req.originalUrl}`, 404));
  });

  app.use(globalErrHandler);

  // ========================== error outside express ===========================
  process.on("unhandledRejection", (err) => {
    console.log(`error outside express ${err}`);
  });

  // =========================== listen on any req ===============================
  app.listen(PORT, (err) => {
    if (err) console.log("error in express server", err);
    else console.log("server is running...");
  });
}
