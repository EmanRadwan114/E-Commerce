import userRouter from "./../modules/user/user.routes.js";

export default function bootstrap(app, express) {
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  app.use("/auth", userRouter);

  app.listen(PORT, (err) => {
    if (err) console.log("error in express server", err);
    else console.log("server is running...");
  });
}
