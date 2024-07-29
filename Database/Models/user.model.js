import mongoose from "mongoose";
import systemRoles from "../../src/utils/systemRoles.js";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minLength: 3,
      maxLength: 15,
      lowerCase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    phone: [String],
    address: [String],
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    isUserLoggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.user,
    },
    passwordChangedAt: Date,
    code: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", schema);

export default User;
