import connectDB from "@/db/connect";
import Admin from "@/models/Admin";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";


export const POST=async (req)=>{
    await connectDB()
    const userId=req.headers.get("userId")

    if(!userId) return NextResponse.json({error:"User Not Authorized"},{status:400})

    const admin=await Admin.findById(userId)
    if(!admin) return NextResponse.json({error:"Unauthorized entity!"},{status:403})

    const data=await req.json()

    if(!data.title || !data.slug || !data.image || !data.content ){
        return NextResponse.json({error:"Fields are empty!"},{status:403})
    }
    data.author=userId
    const blog=new Blog(data);
    await blog.save()
    return NextResponse.json({success:true,blog});
}

export const GET=async(req)=>{
    await connectDB()
    const blogs=await Blog.find({}).populate("author","name").select("-content")
    return NextResponse.json({success:true,blogs});
}

