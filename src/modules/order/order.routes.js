import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import { createOrderSchema } from "./order.validation.js";
import { createOrder } from "./order.controllers.js";

const orderRouter = Router();

// ========================== create order ===========================
orderRouter
  .route("/")
  .post(auth([systemRoles.user]), validation(createOrderSchema), createOrder);

export default orderRouter;
