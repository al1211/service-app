import Joi from "joi";

const phone = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .required()
  .messages({
    "string.pattern.base": "Enter a valid 10-digit Indian mobile number",
    "any.required": "Phone number is required",
  });

const otp = Joi.string().length(6).pattern(/^\d+$/).required().messages({
  "string.length": "OTP must be 6 digits",
  "string.pattern.base": "OTP must be numeric",
  "any.required": "OTP is required",
});

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().lowercase().optional(),
  phone,
  
});

export const sendOtpSchema = Joi.object({ phone });

export const verifyOtpSchema = Joi.object({ phone, otp });

export const refreshTokenSchema = Joi.object({
  token: Joi.string().required().messages({ "any.required": "Refresh token is required" }),
});


export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({ message: "Validation failed", errors });
  }
  next();
};