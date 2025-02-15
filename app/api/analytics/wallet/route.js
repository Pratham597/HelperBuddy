import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import Admin from "@/models/Admin";

export const POST = async (req) => {
  try {
    await connectDB();

    const userId=req.headers.get("userId");
    if(!userId) return NextResponse.json({error:"User unauthorized"},{status:403})

      const admin=await Admin.findById(userId)

      if(!admin) return NextResponse.json({error:"Only Admin allowed"},{status:403})
        

    // Fetch all users who have received a referral bonus
    const referredUsers = await User.find({ referredBy: { $ne: null }, referredBonus: true })
      .select("referredBy wallet createdAt")
      .populate("referredBy", "name email phone") 
      .sort({ createdAt: -1 });

    if (!referredUsers.length) {
      return NextResponse.json({
        success: true,
        message: "No referral transactions yet!",
        stats: {
          totalBonuses: 0,
          totalAmount: 0,
          lastBonusDate: null,
          transactions: [],
          topReferrers: [],
        },
      });
    }

    // Total referral bonuses distributed
    const totalBonuses = referredUsers.length;

    // Calculate total amount given in referral bonuses
    const totalAmount = referredUsers.reduce((sum, user) => sum + (user.wallet || 0), 0);

    // Last referral bonus distribution date
    const lastBonusDate = referredUsers[0]?.createdAt || null;

    // Format transactions for frontend
    const transactions = referredUsers.map(user => ({
      referrerName: user.referredBy?.name || "Unknown",
      referrerEmail: user.referredBy?.email || "Unknown",
      referrerPhone: user.referredBy?.phone || "Unknown",
      amount: user.wallet || 0,
      date: user.createdAt,
    }));

    // Count referrals per referrer
    const referrerCounts = {};
    referredUsers.forEach(user => {
      if (user.referredBy) {
        const referrer = user.referredBy;
        const key = `${referrer.name}-${referrer.email}-${referrer.phone}`;
        referrerCounts[key] = (referrerCounts[key] || 0) + 1;
      }
    });

    // Get top 10 referrers
    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => {
        const [name, email, phone] = key.split("-");
        return { name, email, phone, referralCount: count };
      });

    return NextResponse.json({
      success: true,
      stats: {
        totalBonuses,
        totalAmount,
        lastBonusDate,
        transactions,
        topReferrers,
      },
    });

  } catch (error) {
    console.error("Error fetching referral statistics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
