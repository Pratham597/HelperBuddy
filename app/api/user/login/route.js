import connectDB from "@/db/connect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import generateToken from "@/lib/generateToken";

export const POST = async (req) => {
  await connectDB();
  let data = await req.json();
  if (!data.email || !data.password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  const isMatch = await user.matchPassword(data.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  return NextResponse.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    wallet: user.wallet,
    id: user._id,
    referralCode:user.referralCode,
    token: await generateToken(user._id),
  });
};
