import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const POST= async(req, res)=>{
  const { email, otp } = await req.json();
  if (!email || !otp)
    return NextResponse.json(
      { error: "Email and OTP are required" },
      { status: 400 }
    );

  const triesKey = `otp:tries:${email}`;
  const tries = await redis.incr(triesKey);
  if (tries === 1) await redis.expire(triesKey, 600); // expires in 10 mins

  if (tries > 5) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );  
  }

  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    return NextResponse.json(
      { error: "OTP has expired or does not exist" },
      { status: 400 }
    );
  }

  if (storedOtp !== parseInt(otp)) {
    return NextResponse.json(
      { error: "Invalid OTP" },
      { status: 400 }
    );
  }

  await redis.del(`otp:${email}`);
  await redis.del(triesKey);

  //Store verified flag
  await redis.set(`email:verified:${email}`, "true");

  return NextResponse.json(
    { message: "OTP verified successfully" },
    { status: 200 }
  );
}
