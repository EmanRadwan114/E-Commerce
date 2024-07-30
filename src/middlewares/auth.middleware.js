import jwt from "jsonwebtoken";
import AppError from "../utils/error handling/AppError.js";
import User from "../../Database/Models/user.model.js";

const auth = (roles = []) => {
  return async (req, res, next) => {
    // authentication
    const { token } = req.headers;

    const decoded = jwt.verify(token, process.env.JWT_USER_TOKEN_KEY);

    if (!decoded?.email) return next(new AppError("invalid token", 401));

    const user = await User.findOne({ email: decoded?.email });
    if (!user) return next(new AppError("user not exists", 404));

    if (parseInt(user.passwordChangedAt?.getTime() / 1000) > decoded.iat)
      return next(new AppError("password changed please login again", 401));

    // authorization
    if (!roles.includes(decoded.role))
      return next(new AppError("you are not authorized", 401));

    req.user = user;
    next();
  };
};

export default auth;
