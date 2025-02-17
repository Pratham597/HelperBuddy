import mongoose from "mongoose";


const faqSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true,
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"service",
        required:true,
    }
},{
    timestamps:true
})

export default mongoose.models.faq|| mongoose.model("faq",faqSchema) 