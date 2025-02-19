import Service from "@/models/Service";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";
import User from "@/models/User";
import Partner from "@/models/Partner";
import Booking from "@/models/Payment";

export const GET = async (req, { params }) => {
    await connectDB();

    const { id } = await params;
    const service = await Service.findById(id);
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const orders = await ServiceOrder.find(
        { service: service._id, partner: { $ne: null }, userApproved: true, remarks: { $ne: null } },
        { rating: 1, remarks: 1, payment: 1,user:1 }
    );

    const ratings = [];
    const reviews = await Promise.all(
        orders.map(async (order) => {
            if (order.rating !== undefined) ratings.push(order.rating);
            if (!order.user) return null;

            const user = await User.findById(order.user).select("name");
            if (!user) return null;

            return {
                review: order.remarks || "No review provided",
                customerName: user.name
            };
        })
    );

    const filteredReviews = reviews.filter(review => review !== null);
    const averageRating = ratings.length
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : 5;

    const serviceWithReviews = {
        ...service.toObject(),
        averageRating: averageRating ? parseFloat(averageRating) : 5,
        reviews: filteredReviews
    };
    return NextResponse.json(serviceWithReviews);
};

/** Controller for updating the particular id */
export const PUT = async (req, { params }) => {
    await connectDB();
    const userId = req.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const admin = await Admin.findById(userId);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    let data = await req.json();
    if (!data.name || !data.description || !data.price || !data.category || !data.image || !data.threshold)
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    const service = await Service.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(service);
}