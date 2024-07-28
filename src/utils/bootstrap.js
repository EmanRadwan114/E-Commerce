import categoryRouter from "../modules/category/category.routes.js";
import subCategoryRouter from "../modules/subCategory/subCategory.routes.js";
import userRouter from "./../modules/user/user.routes.js";
import AppError from "./error handling/AppError.js";
import globalErrHandler from "./error handling/globalErrHandler.js";

export default function bootstrap(app, express) {
  const PORT = process.env.PORT || 3000;

  // =============================== body parser ===============================
  app.use(express.json());

  // ============================== routes ===============================
  app.use("/auth", userRouter);
  app.use("/categories", categoryRouter);
  app.use("/sub-categories", subCategoryRouter);

  // ============================== error handler ===============================
  app.use(globalErrHandler);

  app.use("*", (req, res, next) => {
    next(new AppError(`page not found at ${req.originalUrl}`, 404));
  });

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
