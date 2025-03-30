import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis.js";
import sendEmail from "@/actions/user/generateOtp.js";

// Controller to send an OTP to the user's email for verification during the signup process.
export const POST = async (req) => {
  await connectDB();
  let data = await req.json();

  // Check if all required fields are present
  if (!data.email) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  // Check if email or phone already exists
  const existingUser = await User.findOne({ email: data.email});
  if (existingUser) {
    return NextResponse.json(
      { error: "Email or phone number already exists!" },
      { status: 400 }
    );
  }
  const email=data.email;
  // Cooldown: 60 seconds
  const cooldown = await redis.get(`otp:cooldown:${email}`);
  if (cooldown) {
    return NextResponse.json(
      { error: "Please wait before requesting again." },
      { status: 429 })
  }

  // Rate limit: 5 OTPs/hour/email
  const key = `otp:rate:${email}`;
  const attempts = await redis.incr(key);
  if (attempts === 1) await redis.expire(key, 3600);
  if (attempts > 5)
    return res
      .status(429)
      .json({ error: "Too many OTP requests. Try again later." });
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, { ex: 600 }); // 10 min expiry
  await redis.set(`otp:cooldown:${email}`, "1", { ex: 60 }); // 60 sec cooldown
  await sendEmail(email, otp); // Send OTP to user's email
  return NextResponse.json(
    { message: "OTP sent successfully" },
    { status: 200 }
  );
};
