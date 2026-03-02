import mongoose from "mongoose";
const {Schema}=mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, lowercase: true },
  phone: { type: String, unique: true, required: true },
  passwordHash: { type: String },          // bcrypt hashed
  role: { type: String, enum: ['user', 'driver', 'admin'], default: 'user' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String },          // store latest refresh token
  otp: { type: String },
  otpExpiry: { type: Date },
  address: [{
    label: String,                         // 'Home', 'Work'
    coordinates: { lat: Number, lng: Number },
    fullAddress: String
  }]
}, { timestamps: true });



const User=mongoose.model("User",userSchema);

export default User;

