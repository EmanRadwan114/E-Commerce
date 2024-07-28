import mongoose from "mongoose";
import systemRoles from "../../src/utils/systemRoles.js";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      minLength: 3,
      lowerCase: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      minLength: 3,
      lowerCase: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "category owner is required"],
      ref: "User",
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    folderId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Category = mongoose.model("Category", schema);

export default Category;
