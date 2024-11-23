"use client";
  
import React, { useState } from "react";

export default function OTPVerification() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send"); // 'send' or 'verify'

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        setStep("verify");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      if (res.ok) {
        alert("OTP verified successfully!");
        // Handle successful verification (e.g., redirect user)
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div>
      {step === "send" ? (
        <form onSubmit={handleSendOTP}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}
