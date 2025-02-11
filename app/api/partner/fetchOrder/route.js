import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";

export const POST=async (req)=>{
    const userId=req.headers.get("userId");
    if(!userId) return NextResponse.json({error:"User unauthorized"},{status:404});
    const patnerservice=await PartnerService.find({partner:userId});
    const serviceOrder=await ServiceOrder.find({})
}