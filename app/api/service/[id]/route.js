import Service from "@/models/Service";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

/** Controller for fetching particular id */
export const GET=async(req,{params})=>{
    const {id}= await params;
    const service=await Service.findById(id);
    if(!service) return NextResponse.json({error:"Service not found"}, {status:404});
    return NextResponse.json(service);
}

/** Controller for updating the particular id */
export const PUT=async(req,{params})=>{
    const userId=req.headers.get("userId");
    if(!userId) return NextResponse.json({error:"Unauthorized"}, {status:401});
    const admin=await Admin.findById(userId);
    if(!admin) return NextResponse.json({error:"Unauthorized"}, {status:401});
    const {id}=await params;
    let data=req.formData();
    data=Object.fromEntries(data);
    if(!data.name || !data.description || !data.price || !data.category || !data.image) 
        return NextResponse.json({error:"All fields are required"}, {status:400});
    const service=await Service.findByIdAndUpdate(id, data, {new:true});
    return NextResponse.json(service);
}