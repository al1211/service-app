import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import {ENV} from "../../config/env.js"

// ─────────────────────────────────────────
// SEND OTP
// ─────────────────────────────────────────
export const sendOtp = async (phone) => {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

  // Hash OTP before saving to DB
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Upsert: create user if not exists, update OTP if exists
  await User.findOneAndUpdate(
    { phone },
    { phone, otp: hashedOtp, otpExpiry, isVerified: false },
    { upsert: true, new: true }
  );

  // TODO: Send OTP via SMS (Twilio / MSG91 / Fast2SMS)
  // console.log(`OTP for ${phone}: ${otp}`);

  return { success: true,phone,otp };
};

// ─────────────────────────────────────────
// REGISTER USER (save name, email after OTP)
// ─────────────────────────────────────────
export const registerUser = async ({ name, email, phone }) => {
  const user = await User.findOne({ phone });

  if (!user) throw { status: 404, message: "Phone not found. Request OTP first." };
  if (!user.isVerified) throw { status: 403, message: "Phone not verified. Verify OTP first." };

  user.name = name;
  if (email) user.email = email;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};

// ─────────────────────────────────────────
// VERIFY OTP
// ─────────────────────────────────────────
export const verifyOtp = async ({ phone, otp }) => {
  const user = await User.findOne({ phone });

  if (!user) throw { status: 404, message: "User not found" };

  // Check OTP expiry
  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    throw { status: 400, message: "OTP has expired. Please request a new one." };
  }

  // Compare hashed OTP
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) throw { status: 400, message: "Invalid OTP" };

  // Mark phone as verified, clear OTP
  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  // Generate tokens
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save hashed refresh token to DB
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  // Is this a new user (no name yet)?
  const isNewUser = !user.name;

  return { accessToken, refreshToken, isNewUser };
};

// ─────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────
export const refreshToken = async (token) => {
  if (!token) throw { status: 401, message: "Refresh token required" };

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw { status: 401, message: "Invalid or expired refresh token" };
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshToken) throw { status: 401, message: "User not found or logged out" };

  // Validate stored refresh token
  const isValid = await bcrypt.compare(token, user.refreshToken);
  if (!isValid) throw { status: 401, message: "Refresh token mismatch" };

  // Issue new tokens
  const newAccessToken  = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Rotate refresh token in DB
  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return { success: true };
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
const generateAccessToken = (id) =>
  jwt.sign({ id }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });