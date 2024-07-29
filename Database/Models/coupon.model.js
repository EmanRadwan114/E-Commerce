import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "coupon code is required"],
      trim: true,
      minLength: 3,
      lowerCase: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "coupon amount is required"],
      min: 1,
      max: 100,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "coupon owner is required"],
      ref: "User",
    },
    userBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    fromDate: {
      type: Date,
      required: [true, "coupon start date is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "coupon expiry date is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Coupon = mongoose.model("Coupon", schema);

export default Coupon;
