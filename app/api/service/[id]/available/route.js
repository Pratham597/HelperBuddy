import connectDB from "@/db/connect";
import PartnerService from "@/models/PartnerService";
import { NextResponse } from "next/server";

/** Controller for availability of service */
export const GET= async (req,{params}) => { 
    const {id}=await params;
    await connectDB();
    const pincode = req.nextUrl.searchParams.get("pincode");
    if(!pincode) return NextResponse.json({error:"Pincode required"}, {status:400});
    const partnerService=await PartnerService.findOne({service:id,pincode});
    if(!partnerService) return NextResponse.json({error:"Service not available in this area"}, {status:200});
    return NextResponse.json({success:"Service available in this area"}, {status:200});
}
