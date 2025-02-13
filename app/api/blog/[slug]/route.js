import Blog from "@/models/Blog";   
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import Admin from "@/models/Admin";

export const GET=async (req,{params})=>{
    await connectDB()
    const {slug}=params
    console.log(slug)
    if(!slug) return NextResponse.json({error:"Slug Not Found!"},{status:404})
    const blog=await Blog.find({slug}).populate("author","name")
    return NextResponse.json({success:true,blog});
}