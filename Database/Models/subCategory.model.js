import mongoose from "mongoose";
import systemRoles from "../../src/utils/systemRoles.js";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
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
      required: [true, "owner is required"],
      ref: "User",
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: [true, "related category is required"],
      ref: "Category",
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

const SubCategory = mongoose.model("SubCategory", schema);

export default SubCategory;
