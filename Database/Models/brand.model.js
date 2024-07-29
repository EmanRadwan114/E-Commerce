import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
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
      required: [true, "brand owner is required"],
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

const Brand = mongoose.model("Brand", schema);

export default Brand;
