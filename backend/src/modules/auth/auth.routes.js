import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate, registerSchema, sendOtpSchema, verifyOtpSchema, refreshTokenSchema } from "./auth.validator.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/register",     validate(registerSchema),     authController.register);
router.post("/send-otp",     validate(sendOtpSchema),      authController.sendOtp);
router.post("/verify-otp",   validate(verifyOtpSchema),    authController.verifyOtp);
router.post("/refresh",      validate(refreshTokenSchema), authController.refreshToken);
router.post("/logout",       protect,                      authController.logout);

export default router;