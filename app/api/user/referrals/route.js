import connectDB from "@/db/connect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User unauthorized" }, { status: 403 });
    }

    await connectDB();
    const referrals = await User.find(
      { referredBy: userId, referredBonus: true },
      "name email phone"
    ).lean();

    return NextResponse.json({
      success: true,
      totalReferrals: referrals.length,
      referrals,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};
