import ServiceOrder from "@/models/ServiceOrder";
import User from "@/models/User";
import { NextResponse } from "next/server";


export const POST=async(req)=>{
    const userId=req.headers.get("userId");
    const data=await req.json();
    if(!userId || !data.serviceid) return NextResponse.json({error:"Unauthorized"},{status:401});
    const user=await User.findById(userId);
    if(!user) return NextResponse.json({error:'User unauthorized'},{status:403});
    
    const serviceOrder=await ServiceOrder.findById(data.serviceid);
    if(!serviceOrder || !serviceOrder.partner)  return NextResponse.json({error:"Incomplete Data"},{status:404});

    
    if(!data.remarks){
        return NextResponse.json({error:'Remarks Not found!'},{status:404});
    }
    serviceOrder.remarks=data.remarks;
    await serviceOrder.save();
}