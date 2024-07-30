import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "cart owner is required"],
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: [true, "cart products is required"],
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: [true, "product quantity is required"],
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cart = mongoose.model("Cart", schema);

export default Cart;
