import asyncHandler from "./../utils/error handling/asyncHandler.js";
import AppError from "./../utils/error handling/AppError.js";
import User from "../../Database/Models/user.model.js";

const checkEmailMiddleware = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) return next(new AppError("email already exists", 409));

  next();
});

export default checkEmailMiddleware;
