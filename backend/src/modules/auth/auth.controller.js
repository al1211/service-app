import { handle } from "../../middlewares/errorMiddleware.js";

import * as authService from "./auth.service.js";




// POST /auth/request-otp
export const requestOtp = handle(async (req,res) => {
  const {phone}=req.body;
  console.log(phone)
  await authService.requestOtp(phone);
  return { message: `Registered successfully. OTP sent to your ${phone}` };
});

// POST /auth/send-otp  (login trigger / resend)
export const sendOtp = handle(async (req) => {
  await authService.sendOtp(req.body);
  return { message: "OTP sent to your phone." };
});



// POST /auth/verify-otp
export const verifyOtp = handle(async (req) => authService.verifyOtp(req.body));

// POST /auth/logout   (protected)
export const logout = handle(async (req) => {
  await authService.logout(req.user.id);
  return { message: "Logged out successfully." };
});

// POST /auth/refresh
export const refreshToken = handle(async (req) =>
  authService.refreshToken(req.body.token)
);