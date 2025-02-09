import Service from "@/models/Service";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";

/** Controller for creating the service */ 
export const POST=async(req)=>{
    await connectDB();
    const userId=req.headers.get("userId");
    if(!userId) return NextResponse.json({error:"Unauthorized"}, {status:401});
    const admin=await Admin.findById(userId);
    if(!admin) return NextResponse.json({error:"Unauthorized"}, {status:401});
<<<<<<< HEAD
    let data=await req.formData();
    data=Object.fromEntries(data);
=======
    let data=req.json();
>>>>>>> 7d70ebe6085caf8c02ea417e1f18b1779eeb6c1a

    if(!data.name || !data.description || !data.price || !data.category || !data.image) 
        return NextResponse.json({error:"All fields are required"}, {status:400});

    const service=await Service.create(data);
    return NextResponse.json(service);
}
/** Controller for fetching all services */
export const GET=async(req)=>{
    await connectDB();
    const services=await Service.find({});
    return NextResponse.json(services);
}
