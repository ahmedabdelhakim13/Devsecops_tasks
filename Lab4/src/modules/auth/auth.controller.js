import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import { Token } from "../../../DB/models/token.modle.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/nodeMailer.js";
import randomstring from "randomstring";

export const register = asyncHandler(async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return next(new Error("User already exists"));
  }
  const passwordHash = await bcrypt.hash(
    req.body.password,
    parseInt(process.env.SALT_ROUNDS)
  );
  const user = await User.create({
    email: req.body.email,
    password: passwordHash,
  });
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new Error("Invalid email or password"));
  }
  const isMatch = bcrypt.compareSync(req.body.password, user.password);
  if (!isMatch) {
    return next(new Error("Invalid email or password"));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  const tokenUser = await Token.create({
    token,
    userId: user._id,
    agent: req.headers["user-agent"],
  });
  await tokenUser.populate("userId", {
    email: 1,
  });
  if (!tokenUser) {
    return next(new Error("Token creation failed"));
  }
  res.status(200).json({
    status: "success",
    data: {
      user: tokenUser.userId,
      token: tokenUser.token,
    },
  });
});
export const logout = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new Error("You are not logged in"));
  }
  const user = await Token.findOneAndUpdate(
    { userId: req.user._id, token: req.token },
    { isValid: false },
    { new: true }
  );
  console.log(user);
  if (!user) {
    return next(new Error("Invalid token"));
  }

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const resetCode = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new Error("Invalid email"));
  }
  const resetCode = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  user.resetCode = resetCode;
  const messageSent = await sendEmail({
    to: req.body.email,
    subject: "Reset Password",
    html: `<div>Your reset code is ${resetCode}</div>`,
  });

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Reset code sent to your email",
  });
});

export const newPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new Error("Invalid email"));
  }
  if (user.resetCode !== req.body.resetCode) {
    return next(new Error("Invalid reset code"));
  }
  user.password = await bcrypt.hash(
    req.body.password,
    parseInt(process.env.SALT_ROUNDS)
  );
  user.resetCode = undefined;
  await user.save();
  const token = await Token.find({
    userId: user._id,
  });
  token.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
