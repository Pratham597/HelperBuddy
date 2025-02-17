import connectDB from "@/db/connect";
import User from "@/models/User"
import { NextResponse } from "next/server";

export const POST=async(req)=>{
    const userId=req.headers.get("userId");
    if(!userId) return NextResponse.json({error:"User unauthorized"},{status:403});
    await connectDB();
    const user=await User.findById(userId);
    return NextResponse.json({success:true,wallet:user.wallet,referralCode:user.referralCode});
}