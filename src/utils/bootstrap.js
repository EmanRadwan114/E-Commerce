import userRouter from "./../modules/user/user.routes.js";
import AppError from "./error handling/AppError.js";

export default function bootstrap(app, express) {
  const PORT = process.env.PORT || 3000;

  // =============================== body parser ===============================
  app.use(express.json());

  // ============================== routes ===============================
  app.use("/auth", userRouter);

  // ============================== error handler ===============================
  app.use("*", (req, res, next) => {
    next(new AppError(`page not found at ${req.originalUrl}`, 404));
  });

  // =========================== listen on any req ===============================
  app.listen(PORT, (err) => {
    if (err) console.log("error in express server", err);
    else console.log("server is running...");
  });
}
