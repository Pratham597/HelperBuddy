import Partner from "@/models/Partner";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import generateToken from "@/lib/generateToken";

/** Controller for creating the partner */
export const POST = async (req) => {
  await connectDB();
  let data = await req.json();
  if (!data.email || !data.name || !data.password || !data.phone) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  const partner = new Partner(data);
  await partner.save();
  return NextResponse.json({
    name: partner.name,
    email: partner.email,
    id: partner._id,
    phone: partner.phone,
    token: await generateToken(partner._id),
  });
};