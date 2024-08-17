import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "order owner is required"],
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: [true, "productId is required"],
          ref: "Product",
        },
        title: {
          type: String,
          required: [true, "product title is required"],
        },
        quantity: {
          type: Number,
          required: [true, "product quantity is required"],
        },
        price: {
          type: Number,
          required: [true, "product price is required"],
        },
        finalPrice: {
          type: Number,
          required: [true, "product final price is required"],
        },
        priceAfterDiscount: {
          type: Number,
          required: [true, "product price after discount is required"],
        },
        image: {
          type: String,
          required: [true, "product image is required"],
        },
      },
    ],
    orderPrice: {
      type: Number,
      required: [true, "order price is required"],
    },
    priceAfterDiscount: {
      type: Number,
      required: [true, "order final price is required"],
    },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    address: {
      type: String,
      required: [true, "user address is required"],
    },
    phone: {
      type: String,
      required: [true, "user phone is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "payment method is required"],
      enum: ["cash", "card"],
    },
    status: {
      type: String,
      enum: [
        "placed",
        "waitPayment",
        "onWay",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "placed",
    },
    canceledBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      minLength: 3,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model("Order", schema);

export default Order;
