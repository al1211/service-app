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




//  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTU3ZDI4NmU4NjVmMGFhMDUyZjVjYiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzcyNDUzMjMyLCJleHAiOjE3NzI0NTQxMzJ9.ZJcYgfnfkFFC8Y2Tf_1crTHIOpJARQoMp-pNQBU04PM",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTU3ZDI4NmU4NjVmMGFhMDUyZjVjYiIsImlhdCI6MTc3MjQ1MzIzMiwiZXhwIjoxNzczMDU4MDMyfQ.uEsipkbvrl5gGkAh-JpSpAVNbnuP0jSecf8OousJIko",