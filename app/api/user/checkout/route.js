import User from "@/models/User";   
import connectDB from "@/db/connect"; 
import { NextResponse } from "next/server";
import PartnerService from "@/models/PartnerService";


/** Controller for checking out cart */
export const POST= async (req, res) => {
    await connectDB();
    const userId=req.headers.get("userId");
    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status:401});
    }
    const user=await User.findById(userId);
    if(!user){
        return NextResponse.json({error:"Unauthorized"}, {status:401});
    }
    const data=await req.json(); // Array of services
    for(let i=0; i<data.length; i++){
        const service=data[i];
        // Send email to all service providers
        const serviceId=service.serviceId;
        const pincode=service.pincode;
        const serviceProvider=await PartnerService.find({service:serviceId, pincode});
    }
}