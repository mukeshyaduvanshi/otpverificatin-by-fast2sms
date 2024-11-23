import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import OTP from "../../models/OTP";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { phone } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database with correct field name
    await OTP.create({ phoneNumber: phone, otp });

    // Send OTP via Fast2SMS
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": process.env.FAST2SMS_API_KEY as string
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone.replace(/\D/g, ""),
        flash: 0
      }),
    });

    const responseData = await response.json();
    
    if (!responseData.return) {
      console.error("Fast2SMS API Error:", responseData);
      throw new Error(
        `Fast2SMS API Error: ${responseData.message || "Unknown error"}`
      );
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
}
