import Partner from "@/models/Partner";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import generateToken from "@/lib/generateToken";

/** Controller for login partner */
export const POST = async (req) => {
  await connectDB();
  let data = await req.json();
  if (!data.email || !data.password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  const partner = await Partner.findOne({ email: data.email });
  if (!partner) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }
  const isMatch = await partner.matchPassword(data.password);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }
  return NextResponse.json({
    name: partner.name,
    email: partner.email,
    id: partner._id,
    phone: partner.phone,
    pincode: partner.pincode,
    token: await generateToken(partner._id),
  });
};