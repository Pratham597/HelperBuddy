import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import generateToken from "@/lib/generateToken";


/** Controller for creating admin */
export const POST = async (req) => {
  await connectDB();
  let data = await req.json();
  if (!data.email || !data.name || !data.password || !data.phone) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  const admin = new Admin(data);
  await admin.save();
  return NextResponse.json({
    name: admin.name,
    email: admin.email,
    id: admin._id,
    token: await generateToken(admin._id),
    phone: admin.phone
  });
};