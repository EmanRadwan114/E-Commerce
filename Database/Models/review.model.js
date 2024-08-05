import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "review comment is required"],
      trim: true,
      minLength: 3,
    },
    rate: {
      type: Number,
      required: [true, "review rate number is required"],
      min: 1,
      max: 5,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "review owner is required"],
      ref: "User",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: [true, "product is required"],
      ref: "Product",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Review = mongoose.model("Review", schema);

export default Review;
