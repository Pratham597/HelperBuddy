import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import connectDB from "@/db/connect";
import PartnerService from "@/models/PartnerService";
import User from "@/models/User";
import ServiceOrder from "@/models/ServiceOrder";
import Partner from "@/models/Partner";
import Service from "@/models/Service";
import sendEmailToPartner from "@/actions/user/sendEmailToPartner";

export const POST=async(req)=>{
    const userId=req.headers.get("userId");
    if(!userId ) return NextResponse.json({error:"User unauthorized"},{status:403});
    await connectDB();
    const {booking}=await req.json();
    if(!booking) return NextResponse.json({error:"Booking details not found!"},{status:404});
    const userInfo = await Booking.findById(booking._id)
      .populate("user", "-password")
      .select("user");

    const userDetails = await ServiceOrder.findOne({
      booking: booking._id,
    }).select("pincode address timeline");

    const serviceOrders = await ServiceOrder.find({ booking: booking._id })
      .populate("service", "name price")
      .select("service");

    for (let i = 0; i < serviceOrders.length; i++) {
      const service = serviceOrders[i];
      const partners = await PartnerService.find({
        service: service.service._id,
      }).select("partner");

      const partnerIds = partners.map((item) => item.partner);
      const emails = await Partner.find({
        _id: { $in: partnerIds },
        pincode: { $in: [userDetails.pincode] },
      }).select("email");

      if (emails.length == 0)
        return NextResponse.json(
          { error: "No patners are available at that pincode :(" },
          { status: 404 }
        );
      userDetails.name = userInfo.user.name;
      userDetails.phone = userInfo.user.phone;
      await sendEmailToPartner(emails, userDetails, service.service);
    }
    
    const { user } = userInfo;
    if (user && user.referredBy && !user.referredBonus) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const referralBonus = Number(process.env.REFFER_POINTS);
        const maxWalletLimit = 1000;
        const updatedWallet = Math.min(
          referrer.wallet + referralBonus,
          maxWalletLimit
        );
        if (updatedWallet > referrer.wallet) {
          await User.findByIdAndUpdate(
            user.referredBy,
            { $set: { wallet: updatedWallet } },
            { new: true }
          );
        }
        await User.findByIdAndUpdate(user._id, { referredBonus: true });
      }
    }
    return NextResponse.json({success:true,message:"Post payment done successfully!"})
}