import dbConnect from '../../lib/dbConnect';
import OTP from '../../models/OTP';
  
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { phone } = req.body;
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to database
    await OTP.create({ phone, otp });

    // Send OTP via MSG91
    await fetch(
      'https://api.msg91.com/api/v5/flow/',
      {
        flow_id: process.env.MSG91_TEMPLATE_ID,
        sender: 'SENDER',
        mobiles: phone,
        VAR1: otp, // Template variable for OTP
      },
      {
        headers: {
          'authkey': process.env.MSG91_AUTH_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
} 