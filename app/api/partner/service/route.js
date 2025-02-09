import PartnerService from "@/models/PartnerService";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";


/** Controller for creating service under partner */
export const POST=async(req)=>{
    const userId=req.headers.get("userId");
    let data=await req.formData();
    data=Object.fromEntries(data);
    
    const user=await Partner.findById(userId);
    if(!user){
        return NextResponse.json({error:"User not found"},{status:403});
    }
    if(user.isApproved!=="1"){
        return NextResponse.json({error:"User not approved"},{status:403});
    }
    if(!data.serviceId || !data.pincode){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    const service=await PartnerService.create({
        partner:userId,
        service:data.serviceId,
        pincode:data.pincode
    });
    return NextResponse.json({success:true,service});
}

/** Controller for getting services under partner */
export const GET=async(req)=>{
    const userId=req.headers.get("userId");
    if(!userId) return NextResponse.json({error:"User not found"},{status:403});
    const user=await Partner.findById(userId);
    if(!user){
        return NextResponse.json({error:"User not found"},{status:403});
    }
    if(user.isApproved==="1" || user.isApproved==="-1"){
        return NextResponse.json({error:"User not approved"},{status:403});
    }
    const services=await PartnerService.find({partner:userId});
    return NextResponse.json({services});
}