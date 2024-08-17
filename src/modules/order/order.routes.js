import express from "express";
import auth from "./../../middlewares/auth.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import systemRoles from "./../../utils/systemRoles.js";
import {
  cancelOrderSchema,
  createOrderSchema,
  getAllOrdersSchema,
  getUserOrdersSchema,
} from "./order.validation.js";
import {
  cancelOrder,
  createOrder,
  createWebhook,
  getAllOrders,
  getUserOrders,
  handlePaymentCancel,
  handlePaymentSuccess,
} from "./order.controllers.js";

const orderRouter = express.Router();

// ========================== create order ===========================
orderRouter
  .route("/")
  .post(auth([systemRoles.user]), validation(createOrderSchema), createOrder)
  .get(
    auth(Object.values(systemRoles)),
    validation(getAllOrdersSchema),
    getAllOrders
  );

// ================================ get user orders ======================================
orderRouter.get(
  "/user",
  auth(Object.values(systemRoles)),
  validation(getUserOrdersSchema),
  getUserOrders
);

// ================= handle online payment success / cancel =================
orderRouter.get("/success/:orderId", handlePaymentSuccess);
orderRouter.get("/cancel/:orderId", handlePaymentCancel);

// ========================== create webhook ==================================
orderRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  createWebhook
);

// ========================== cancel /update order =============================
orderRouter.put(
  "/:orderId",
  auth([systemRoles.user]),
  validation(cancelOrderSchema),
  cancelOrder
);

export default orderRouter;
