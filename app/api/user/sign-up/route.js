import generateToken from "@/lib/generateToken";
import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";

 /** Controller to create a new user */ 
export const POST = async (req) => {
  await connectDB();
  let data = await req.formData();
  data = Object.fromEntries(data);
  if (!data.email || !data.name || !data.password || !data.phone) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  // Check user contains refferal code or not!
  if (data.refferalCode) {
    const refferalCode = data.refferalCode;
    const currUser = await User.findOne({ refferalCode });
    if (!currUser) {
      return NextResponse.json(
        { error: "Invalid refferal code" },
        { status: 400 }
      );
    }
    data.refferedBy = currUser._id;
    const user = new User(data);
    await user.save();
    await currUser.save();
    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      wallet: user.wallet,
      id: user._id,
      token: await generateToken(user._id),
    });
  } else {
    const user = new User(data);
    await user.save();
    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      wallet: user.wallet,
      id: user._id,
      token: await generateToken(user._id),
    });
  }
};