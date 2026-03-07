import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosInstance";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export interface RequestOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface RegisterPayload {
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  role: "user" | "driver" | "admin";
  avatar?: string;
  isVerified: boolean;
}

// ─────────────────────────────────────────
// REQUEST OTP
// ─────────────────────────────────────────
export const requestOtp = async (payload: RequestOtpPayload): Promise<{ message: string }> => {
  const response = await axiosInstance.post("/auth/request-otp", payload);
  return response.data;
};

// ─────────────────────────────────────────
// VERIFY OTP → returns tokens
// ─────────────────────────────────────────
export const verifyOtp = async (payload: VerifyOtpPayload): Promise<AuthTokens> => {
  const response = await axiosInstance.post("/auth/verify-otp", payload);
  const { accessToken, refreshToken, isNewUser } = response.data;

  // Save tokens to AsyncStorage
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  return { accessToken, refreshToken, isNewUser };
};

// ─────────────────────────────────────────
// REGISTER — save name, email, avatar
// ─────────────────────────────────────────
export const registerUser = async (payload: RegisterPayload): Promise<{ user: User }> => {
  const response = await axiosInstance.post("/auth/register", payload);

  // Save user to AsyncStorage
  await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (_) {
    // even if API fails, clear local storage
  } finally {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
  }
};

// ─────────────────────────────────────────
// GET STORED USER (no API call)
// ─────────────────────────────────────────
export const getStoredUser = async (): Promise<User | null> => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ─────────────────────────────────────────
// CHECK IF LOGGED IN (no API call)
// ─────────────────────────────────────────
export const isLoggedIn = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem("accessToken");
  return !!token;
};