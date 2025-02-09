import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import generateToken from "@/lib/generateToken";

/** Controller for admin login */
export const POST = async (req) => {
  await connectDB();
  let data = await req.json();
  if (!data.email || !data.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }
  const admin = await Admin.findOne({ email: data.email });
  if (!admin || !(await admin.matchPassword(data.password))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }
  return NextResponse.json({
    name: admin.name,
    email: admin.email,
    id: admin._id,
    token:await  generateToken(admin._id),
    phone:admin.phone
  });
};