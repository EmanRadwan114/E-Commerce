import "dotenv/config";
import Stripe from "stripe";
import asyncHandler from "./../../utils/error handling/asyncHandler.js";
import AppError from "../../utils/error handling/AppError.js";
import Cart from "./../../../Database/Models/cart.model.js";
import Product from "../../../Database/Models/product.model.js";
import Order from "./../../../Database/Models/order.model.js";
import Coupon from "./../../../Database/Models/coupon.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";
import createInvoice from "../../utils/invoice.js";
import sendEmails from "../../utils/nodemailer/sendEmails.js";
import onlinePayment from "../../utils/onlinePayment.js";

// ========================================= create order =========================================
export const createOrder = asyncHandler(async (req, res, next) => {
  const { address, phone, paymentMethod, productId, quantity, couponCode } =
    req.body;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toLowerCase(),
      usedBy: { $nin: [req.user._id] },
    });

    if (!coupon)
      return next(new AppError("coupon not found or already used", 404));

    if (coupon.expiryDate < Date.now())
      return next(new AppError("coupon is expired", 409));

    req.body.coupon = coupon;
  }

  let orderProducts = [];
  let flag = false;

  // ^ scenario 1 ==> order products sent in req.body
  if (productId && quantity) {
    orderProducts = [
      {
        productId,
        quantity,
      },
    ];
  } else {
    // ^ scenario 2 ==> order products exists in cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return next(new AppError("Cart not found", 404));

    if (!cart.products.length)
      return next(
        new AppError("Cart is empty, please add products to order", 409)
      );
    orderProducts = cart.products;
    flag = true;
  }

  let finalOrderProducts = [];
  let orderPrice = 0;

  for (let product of orderProducts) {
    const checkProduct = await Product.findById(product.productId);

    if (!checkProduct) return next(new AppError("product not found", 404));

    if (flag) product = product.toObject();

    product.title = checkProduct.title;
    product.price = checkProduct.price;
    product.priceAfterDiscount = checkProduct.finalPrice;
    product.finalPrice = checkProduct.finalPrice * product.quantity;
    orderPrice += product.finalPrice;
    finalOrderProducts.push(product);
  }

  const order = new Order({
    user: req.user._id,
    products: finalOrderProducts,
    orderPrice,
    priceAfterDiscount:
      orderPrice - orderPrice * ((req.body.coupon?.amount || 0) / 100),
    paymentMethod,
    couponId: req.body.coupon?._id,
    status: paymentMethod === "cash" ? "placed" : "waitPayment",
    address,
    phone,
  });

  if (!order) return next(new AppError("order not created", 404));

  await order.save();

  req.data = {
    model: Order,
    id: order._id,
    coupon: order.couponId,
    user: order.user,
  };

  if (req.body?.coupon) {
    await Coupon.updateOne(
      { _id: req.body.coupon._id },
      { $push: { usedBy: req.user._id } }
    );
  }

  for (const product of finalOrderProducts) {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: {
        stock: -product.quantity,
      },
    });
  }

  // create invoice
  const invoice = {
    shipping: {
      name: req.user.name,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    paid: order.priceAfterDiscount,
    invoice_nr: order._id,
    date: order.createdAt,
    subtotal: order.orderPrice,
  };

  await createInvoice(invoice, "./invoice.pdf");

  await sendEmails(req.user.email, "order invoice", "", [
    {
      path: "./invoice.pdf",
      name: "invoice.pdf",
      type: "application/pdf",
    },
  ]);

  if (paymentMethod === "card") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.amount,
        duration: "once",
      });
      req.body.couponId = coupon.id;
    }

    const session = await onlinePayment({
      stripe,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
      cancel_url: `${req.protocol}://${req.headers.host}/orders/cancel/${order._id}`,
      discounts: req.body.coupon ? [{ coupon: req.body.couponId }] : [],
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.title,
              images: [product.image.secure_url],
            },
            unit_amount: product.finalPrice,
          },
          quantity: product.quantity,
        };
      }),
    });
    return res.status(201).json({
      message: "success",
      session_url: session.url,
      data: order,
    });
  }

  if (flag) {
    await Cart.findOneAndUpdate({ user: req.user._id }, { products: [] });
  }

  res.status(201).json({ message: "success", data: order });
});

// ================================= handle payment success ======================================
export const handlePaymentSuccess = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) return next(new AppError("order not found", 404));

  res.status(200).json({ message: "success", data: order });
});

// =================================== handle payment cancel ======================================
export const handlePaymentCancel = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) return next(new AppError("order not found", 404));

  res.status(200).json({ message: "order payment is canceled", data: order });
});

// ========================================= create webhook ======================================

export const createWebhook = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.ENDPOINT_SECRET
  );

  if (!event) return next(new AppError(`Webhook Error: ${err.message}`, 400));

  // Handle the event
  const { orderId } = event.data.object.metadata;

  if (event.type !== "checkout.session.completed") {
    const order = await Order.findByIdAndUpdate(orderId, {
      status: "rejected",
    });

    return res
      .status(400)
      .json({ message: "order payment is rejected", data: order });
  }
  const order = await Order.findByIdAndUpdate(orderId, {
    status: "placed",
  });

  return res.status(200).json({ message: "order is placed", data: order });
});

// ========================================= cancel Order ======================================

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const orderExist = await Order.findOne({
    user: req.user._id,
    _id: orderId,
  });

  if (!orderExist) return next(new AppError("order not found", 404));

  if (
    (orderExist.paymentMethod === "cash" && orderExist.status !== "placed") ||
    (orderExist.paymentMethod === "card" && orderExist.status !== "waitPayment")
  ) {
    return next(new AppError("order can't be canceled", 409));
  }

  const order = await Order.updateOne(
    { _id: orderId },
    { $set: { status: "canceled", canceledBy: req.user._id, reason } }
  );

  if (orderExist.couponId) {
    await Coupon.updateOne(
      { _id: orderExist.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }

  for (const product of orderExist.products) {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: {
        stock: product.quantity,
      },
    });
  }

  res.json({ message: "success", date: order });
});

// ===================================== get All orders  ======================================
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Order.find({})
      .populate([
        {
          path: "user",
          select: "name -_id",
        },
      ])
      .select("products orderPrice priceAfterDiscount status -_id"),
    req.query
  ).pagination();

  const orders = await apiFeatures.mongooseQuery;

  if (!orders) return next(new AppError("no orders found", 404));

  res.json({ message: "success", page: apiFeatures.page, data: orders });
});

// ===================================== get user orders ======================================
export const getUserOrders = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Order.find({ user: req.user._id })
      .populate([
        {
          path: "user",
          select: "name -_id",
        },
      ])
      .select("products orderPrice priceAfterDiscount status -_id"),
    req.query
  ).pagination();

  const orders = await apiFeatures.mongooseQuery;

  if (!orders) return next(new AppError("no orders found", 404));

  res.json({ message: "success", page: apiFeatures.page, data: orders });
});
