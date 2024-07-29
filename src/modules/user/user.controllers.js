import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import sendEmails from "../../utils/nodemailer/sendEmails.js";
import User from "../../../Database/Models/user.model.js";
import AppError from "../../utils/error handling/AppError.js";
import { nanoid } from "nanoid";

// ========================================= signup =========================================
export const signup = asyncHandler(async (req, res, next) => {
  let { email, password, age, phone, address, name } = req.body;

  const hashedPass = await bcrypt.hash(password, +process.env.SALT_ROUND);
  password = hashedPass;

  const user = new User({
    email,
    password,
    age,
    phone,
    address,
    name: name.toLowerCase(),
  });
  await user.save();

  if (!user)
    return next(
      new AppError("something went wrong in the sign up process", 500)
    );

  const token = jwt.sign({ email }, process.env.JWT_VERIFY_EMAIL_KEY, {
    expiresIn: 60 * 10,
  });

  const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_TOKEN_KEY);

  await sendEmails(
    email,
    "",
    `
           <a href= "${req.protocol}://${req.headers.host}/auth/verifyEmail/${token}" style="padding:7px 12px; background-color:transparent; 
                 border:1px solid blue; color:blue; font-size:20px; font-weight:600" target="_blank">
                 Click here to verify
            </a> 
            <br><br>
           <a href= "${req.protocol}://${req.headers.host}/auth/refreshToken/${refreshToken}" style="padding:7px 12px; background-color:transparent; 
                 border:1px solid blue; color:grey; font-size:18px; font-weight:500" target="_blank">
                 Click here to Generate a new verification link
            </a> 
        
        `
  ).catch((err) => next(err));

  res.status(201).json({
    message: "success",
  });
});

// ========================================= verifyEmail =========================================
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.JWT_VERIFY_EMAIL_KEY);

  if (!decoded?.email) return next(new AppError("invalid token", 401));

  const user = await User.findOneAndUpdate(
    { email: decoded.email, isEmailConfirmed: false },
    { isEmailConfirmed: true },
    { new: true }
  );

  if (!user)
    return next(new AppError("user does not exist or already verified", 400));

  res.json({
    message: "success",
    data: user,
  });
});

// ========================================= refreshToken =========================================
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.params;

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY, {
    expiresIn: 60 * 10,
  });

  if (!decoded?.email) return next(new AppError("invalid token", 401));

  const user = await User.findOne({
    email: decoded.email,
    isEmailConfirmed: true,
  });

  if (user) return next(new AppError("user is already verified", 400));

  const token = jwt.sign(
    { email: decoded?.email },
    process.env.JWT_VERIFY_EMAIL_KEY,
    {
      expiresIn: 60 * 10,
    }
  );

  await sendEmails(
    decoded?.email,
    "",
    `    <a href= "${req.protocol}://${req.headers.host}/auth/verifyEmail/${token}" style="padding:7px 12px; background-color:transparent; 
             border:1px solid blue; color:blue; font-size:20px; font-weight:600" target="_blank">
             Click here to verify
        </a>  `
  ).catch((err) => next(err));

  res.json({
    message: "success",
  });
});

// ========================================= sign in ==========================================
export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isEmailConfirmed: true });

  if (!user || !(await bcrypt.compare(password, user?.password)))
    return next(new AppError("invalid email or password", 401));

  const userToken = jwt.sign(
    { email: user.email, role: user.role, name: user.name },
    process.env.JWT_USER_TOKEN_KEY
  );

  await User.updateOne({ email }, { isUserLoggedIn: true });

  return res.json({ message: "success", token: userToken });
});

// ========================================= forget password ==========================================
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("user does not exist", 404));

  const code = nanoid(5);

  await sendEmails(
    email,
    "Forget Password OTP Code",
    `<h1 style="font-weight:900; font-size:30px; color:blue">Your OTP code is ${code}</h1>`
  ).catch((err) => next(err));

  await User.updateOne({ email }, { code }).catch((err) => next(err));

  res.json({ message: "success" });
});

// ========================================= reset password ==========================================
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("user does not exist", 404));

  const hashedPass = await bcrypt.hash(password, +process.env.SALT_ROUND);

  if (user.code !== code || code == "")
    return next(new AppError("invalid code", 401));

  await User.updateOne(
    { _id: user._id },
    { password: hashedPass, code: "", passwordChangedAt: Date.now() }
  );

  return res.json({ message: "success" });
});
