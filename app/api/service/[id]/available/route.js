import Service from "@/app/services/page";
import PartnerService from "@/models/PartnerService";

/** Controller for availability of service */
export const GET= async (req,{params}) => { 
    const {id}=await params;
    await connectDB();
    let data=await req.json();
    const {pincode}=data;
    if(!pincode) return NextResponse.json({error:"Pincode required"}, {status:400});
    const partnerService=await PartnerService.findOne({service:id,pincode});
    if(!partnerService) return NextResponse.json({error:"Service not available in this area"}, {status:404});
    return NextResponse.json({success:true});
}
