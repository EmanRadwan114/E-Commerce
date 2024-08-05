import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "wishlist owner is required"],
      ref: "User",
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        required: [true, "product is required"],
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WishList = mongoose.model("WishList", schema);

export default WishList;
