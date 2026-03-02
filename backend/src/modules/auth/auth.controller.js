import * as authService from "./auth.service.js";

const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json(result ?? { message: "Success" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// POST /auth/register
export const register = handle(async (req) => {
  await authService.register(req.body);
  return { message: "Registered successfully. OTP sent to your phone." };
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