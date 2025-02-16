import generateToken from "@/lib/generateToken";
import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import { generateUniqueReferralCode } from "@/actions/user/refferalCode";

/** Controller to create a new user */
export const POST = async (req) => {
  try {
    await connectDB();
    let data = await req.json();

    if (!data.email || !data.name || !data.password || !data.phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: data.email }, { phone: data.phone }] 
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email or phone number already in use" }, { status: 400 });
    }

    if (data.referralCode) {
      const currUser = await User.findOne({ referralCode: data.referralCode });
      if (!currUser) {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
      }
      data.referredBy = currUser._id;
    }
    data.referralCode = await generateUniqueReferralCode();


    const user = new User(data);
    await user.save();

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      wallet: user.wallet,
      id: user._id,
      referralCode:user.referralCode,
      token: await generateToken(user._id),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
