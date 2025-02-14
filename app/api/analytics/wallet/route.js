import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();

    // Find all users who have received a referral bonus and populate the referrer details
    const referredUsers = await User.find({ referredBy: { $ne: null }, referredBonus: true })
      .select("referredBy wallet createdAt")
      .populate("referredBy", "name email phone") // Populate the name, email, and phone of the referrer
      .sort({ createdAt: -1 });

    if (!referredUsers.length) {
      return NextResponse.json({ success: true, message: "No referral bonuses distributed yet!" });
    }

    // Calculate statistics
    const totalReferralBonuses = referredUsers.length;
    const totalAmountGiven = referredUsers.reduce((sum, user) => sum + Number(process.env.REFER_POINT), 0);
    const lastBonusDate = referredUsers[0]?.createdAt || null;

    // Find top referrers
    const referrerCounts = {};
    referredUsers.forEach(user => {
      const referrer = user.referredBy; // Get the referrer details
      const referrerKey = `${referrer.name}-${referrer.email}-${referrer.phone}`; // Unique key for referrer (combining name, email, phone)
      referrerCounts[referrerKey] = (referrerCounts[referrerKey] || 0) + 1;
    });

    // Sort referrers by highest referrals
    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.min(10,Object.keys(referredUsers).length))
      .map(([referrerKey, count]) => {
        const [name, email, phone] = referrerKey.split("-");
        return { name, email, phone, referralCount: count };
      });

    return NextResponse.json({
      success: true,
      stats: {
        totalReferralBonuses,
        totalAmountGiven,
        lastBonusDate,
        topReferrers,
      }
    });

  } catch (error) {
    console.error("Error fetching referral bonus statistics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
