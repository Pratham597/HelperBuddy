import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import generateToken from "@/lib/generateToken";

/** Controller for creating new  admin */
export const POST = async (req) => {
  await connectDB();
  const userId =req.headers.get("userId");
  if(!userId) return NextResponse.json({error:'Admin only allowed!'},{status:403});
  const user=await Admin.findById(userId);
  if(!user && user.email==="helperbuddy@gmail.com") return NextResponse.json({error:'Admin only allowed!'},{status:403});
  
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
    admin,
  });
};
