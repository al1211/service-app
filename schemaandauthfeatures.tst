// users/user.model.js
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
}, { timestamps: true })



Driver Model
js// drivers/driver.model.js
const driverSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String },
  vehicleType: { type: String, enum: ['bike', 'car', 'van'] },
  vehicleNumber: { type: String },
  isOnline: { type: Boolean, default: false },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]                  // [lng, lat] — GeoJSON format
  },
  rating: { type: Number, default: 5.0 },
  totalEarnings: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }  // admin approves driver
}, { timestamps: true })

driverSchema.index({ currentLocation: '2dsphere' })  // for geo queries
Service/Restaurant Model
js// services/service.model.js
const serviceSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['food', 'grocery', 'pharmacy', 'courier'] },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  rating: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  address: { type: String },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
}, { timestamps: true })

serviceSchema.index({ location: '2dsphere' })
Order Model
js// orders/order.model.js
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  items: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    name: String,
    quantity: Number,
    price: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'online'] },
  deliveryAddress: {
    fullAddress: String,
    coordinates: { lat: Number, lng: Number }
  },
  estimatedTime: { type: Number },         // in minutes
  otp: { type: String },                   // delivery confirmation OTP
  timeline: [{                             // full status history
    status: String,
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

3. Auth Controller Logic
js// auth/auth.service.js

// REGISTER
const register = async ({ name, phone, email, password }) => {
  const exists = await User.findOne({ phone })
  if (exists) throw new ApiError(400, 'Phone already registered')

  const passwordHash = await bcrypt.hash(password, 12)
  const otp = generateOTP()                // 6-digit random
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)  // 10 mins

  const user = await User.create({ name, phone, email, passwordHash, otp, otpExpiry })
  await sendSMS(phone, `Your OTP is ${otp}`)  // Twilio or MSG91

  return { message: 'OTP sent', userId: user._id }
}

// VERIFY OTP
const verifyOtp = async ({ userId, otp }) => {
  const user = await User.findById(userId)
  if (!user || user.otp !== otp) throw new ApiError(400, 'Invalid OTP')
  if (user.otpExpiry < Date.now()) throw new ApiError(400, 'OTP expired')

  user.isVerified = true
  user.otp = undefined
  user.otpExpiry = undefined
  await user.save()

  const { accessToken, refreshToken } = generateTokens(user)
  user.refreshToken = refreshToken
  await user.save()

  return { accessToken, refreshToken, user: sanitizeUser(user) }
}

// LOGIN
const login = async ({ phone, password }) => {
  const user = await User.findOne({ phone })
  if (!user) throw new ApiError(404, 'User not found')
  if (!user.isVerified) throw new ApiError(403, 'Phone not verified')

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) throw new ApiError(401, 'Invalid credentials')

  const { accessToken, refreshToken } = generateTokens(user)
  user.refreshToken = refreshToken
  await user.save()

  return { accessToken, refreshToken, user: sanitizeUser(user) }
}
Token Generation
js// utils/generateToken.js
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}
Auth Middleware
js// middlewares/authMiddleware.js
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new ApiError(401, 'Not authorized')

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  req.user = await User.findById(decoded.id).select('-passwordHash -refreshToken')
  if (!req.user) throw new ApiError(401, 'User not found')
  next()
})

// Role middleware
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    throw new ApiError(403, 'Access denied')
  next()
}
```

---

## 4. Security Checklist

| What | How |
|------|-----|
| Passwords | `bcrypt` with salt rounds 12 |
| Tokens | Short-lived JWT + refresh token rotation |
| OTP | Expire in 10 mins, hash before storing |
| Rate limiting | `express-rate-limit` on auth routes |
| Input validation | `express-validator` or `Joi` on all inputs |
| CORS | Whitelist only your frontend domains |
| Helmet | `helmet` package for HTTP security headers |
| Env secrets | Never hardcode, always `.env` |
| Refresh token | Rotate on every use, invalidate on logout |

---

## 5. Auth Routes Summary
```
POST  /api/auth/register       → send OTP
POST  /api/auth/verify-otp     → verify & get tokens
POST  /api/auth/login          → login with password
POST  /api/auth/refresh        → get new access token
POST  /api/auth/logout         → invalidate refresh token
POST  /api/auth/forgot-password → send reset OTP
POST  /api/auth/reset-password  → reset with OTP

This gives you a production-ready auth foundation. Want me to go deeper on any specific part — like the refresh token rotation logic, role-based route protection, or the order status flow next? Sonnet 4.6Claude is AI and can make mistakes. Please double-check responses.