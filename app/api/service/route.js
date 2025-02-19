import Service from "@/models/Service";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";

export const POST = async (req) => {
    await connectDB();
    const userId = req.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const admin = await Admin.findById(userId);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let data = await req.json();

    if (!data.name || !data.description || !data.price || !data.category || !data.image || !data.threshold)
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const service = await Service.create(data);
    return NextResponse.json(service);
}

export const GET = async (req) => {
    await connectDB();

    const services = await Service.find({});

    const servicesWithReviews = await Promise.all(
        services.map(async (service) => {
            const orders = await ServiceOrder.find(
                { service: service._id, }, 
                { rating: 1, remarks: 1, _id: 0 } 
            );
            const ratings = orders.map(order => order.rating).filter(r => r !== undefined);
            const reviews = orders.map(order => order.remarks).filter(r => r !== undefined);

            const averageRating = ratings.length 
                ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) 
                : null; 

            return {
                ...service.toObject(), 
                rating: averageRating ? parseFloat(averageRating) : 5, 
                reviews,
                total_bookings: orders.length
            };
        })
    );
    return NextResponse.json(servicesWithReviews);
};

