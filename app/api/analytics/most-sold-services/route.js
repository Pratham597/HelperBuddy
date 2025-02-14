import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";
import {NextResponse} from "next/server";
import Service from "@/models/Service";

export const GET= async (req)=>{
  await connectDB();
  try {
    const mostSoldServices = await ServiceOrder.aggregate([
        { $group: { _id: "$service", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      const populatedServices = await ServiceOrder.populate(mostSoldServices, { path: "_id", model: "service" });
      console.log(populatedServices);
      return NextResponse.json({services:populatedServices});
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"},{status:500});
  }
}
