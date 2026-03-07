
import { handle } from "../../middlewares/errorMiddleware.js";
import * as authService from "./auth.service.js";

// POST /auth/request-otp
export const requestOtp = handle(async (req, res) => {
  const { phone } = req.body;
 const allthing= await authService.sendOtp(phone);
//  console.log("allthing",allthing);
  return { message: `OTP sent successfully to ${phone} to ${allthing.otp}` };
});

// POST /auth/register
export const regitster = handle(async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await authService.registerUser({ name, email, phone });
  return { message: "User registered successfully", user };
});

// POST /auth/verify-otp
export const verifyOtp = handle(async (req, res) => {
  const { phone, otp } = req.body;
  const tokens = await authService.verifyOtp({ phone, otp });
  return { message: "OTP verified successfully", ...tokens };
});

// POST /auth/refresh
export const refreshToken = handle(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshToken(refreshToken);
  return { message: "Token refreshed successfully", ...tokens };
});

// POST /auth/logout
export const logout = handle(async (req, res) => {
  await authService.logout(req.user._id);
  return { message: "Logged out successfully" };
});
