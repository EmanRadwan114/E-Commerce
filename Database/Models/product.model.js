import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      minLength: 3,
      maxLength: 50,
      lowerCase: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
      lowerCase: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 3,
      required: [true, "product description is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "product owner is required"],
      ref: "User",
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: [true, "related category is required"],
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      required: [true, "related sub-category is required"],
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: [true, "related brand is required"],
      ref: "Brand",
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    coverImages: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    folderId: String,
    price: {
      type: Number,
      required: [true, "product price is required"],
      min: 1,
    },
    discount: {
      type: Number,
      min: 1,
      max: 100,
      default: 1,
    },
    finalPrice: {
      type: Number,
      default: 1,
    },
    stock: {
      type: Number,
      default: 1,
      required: [true, "product stock amount is required"],
    },
    avgRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", schema);

export default Product;
