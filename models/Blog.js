import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true,trim:true },
  slug: { type: String, required: true, unique: true,trim:true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "admin",required:true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.blog || mongoose.model("blog", blogSchema);
