import User from "../user/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";


// expire will be 15 minute
export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN,
  });

  // expire will be 7 days
export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, ENV.REFRESH_TOKEN_SECRET, {expiresIn : ENV.REFRESH_TOKEN_EXPIRES_IN});

export const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};


// ─── OTP ──────────────────────────────────────────────────────────────────────

export const generateAndSaveOtp = async (phone) => {
  const user = await User.findOne({ phone });
  if (!user) throw { status: 404, message: "User not found" };

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  // TODO: integrate MSG91 / Twilio / Firebase
  console.log(`OTP for ${phone}: ${otp}`);

  return otp;
};



export const register = async ({ name, email, phone }) => {
  const exists = await User.findOne({ phone });
  if (exists) throw { status: 409, message: "phone Number is already registered" };

  await User.create({ name, email, phone });
  await generateAndSaveOtp(phone);
};

export const sendOtp = async ({ phone }) => {
  const user = await User.findOne({ phone });
  if (!user) throw { status: 404, message: "User not found. Please register first." };
  if (!user.isActive) throw { status: 403, message: "Account deactivated" };

  await generateAndSaveOtp(phone);
};

export const verifyOtp = async ({ phone, otp }) => {
  const user = await User.findOne({ phone });
  console.log(phone,otp);
  if (!user) throw { status: 404, message: "User not found" };
  if (user.otp !== otp) throw { status: 400, message: "Invalid OTP" };
  if (user.otpExpiry < new Date()) throw { status: 400, message: "OTP expired" };

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user: sanitizeUser(user) };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const refreshToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw { status: 403, message: "Token expired or invalid" };
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token)
    throw { status: 403, message: "Invalid refresh token" };

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};