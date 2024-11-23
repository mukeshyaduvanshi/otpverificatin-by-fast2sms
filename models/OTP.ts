import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires in 5 minutes
  },
});

const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
export default OTP;
