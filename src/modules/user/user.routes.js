import { Router } from "express";
import checkEmailMiddleware from "../../middlewares/checkEmail.middleware.js";
import validation from "./../../middlewares/validation.middleware.js";
import auth from "./../../middlewares/auth.middleware.js";
import systemRoles from "../../utils/systemRoles.js";
import {
  forgetPassword,
  refreshToken,
  resetPassword,
  signin,
  signup,
  verifyEmail,
} from "./user.controllers.js";
import {
  forgetPassSchema,
  refreshTokenSchema,
  resetPassSchema,
  signinSchema,
  signupSchema,
  verifyEmailSchema,
} from "./user.validation.js";

const userRouter = Router();

// ========================================= sign up ==========================================
userRouter.post(
  "/signup",
  validation(signupSchema),
  checkEmailMiddleware,
  signup
);

// ========================================= verify email ==========================================
userRouter.get(
  "/verifyEmail/:token",
  validation(verifyEmailSchema),
  verifyEmail
);

// ========================================= refresh token =========================================
userRouter.get(
  "/refreshToken/:refreshToken",
  validation(refreshTokenSchema),
  refreshToken
);

// ========================================= sign in ==========================================
userRouter.post("/signin", validation(signinSchema), signin);

// ========================================= forget password ==========================================
userRouter.patch(
  "/forgetPassword",
  validation(forgetPassSchema),
  auth(Object.values(systemRoles)),
  forgetPassword
);

userRouter.patch(
  "/resetPassword",
  validation(resetPassSchema),
  auth(Object.values(systemRoles)),
  resetPassword
);

export default userRouter;
