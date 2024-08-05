import { Router } from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import { cancelOrderSchema, createOrderSchema } from "./order.validation.js";
import { cancelOrder, createOrder } from "./order.controllers.js";

const orderRouter = Router();

// ========================== create order ===========================
orderRouter
  .route("/")
  .post(auth([systemRoles.user]), validation(createOrderSchema), createOrder);

// ========================== cancel /update order =============================
orderRouter.put(
  "/:orderId",
  auth([systemRoles.user]),
  validation(cancelOrderSchema),
  cancelOrder
);

export default orderRouter;
