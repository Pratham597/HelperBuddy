import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";
import Service from "@/models/Service";

export const GET = async (req) => {
    await connectDB();
    try {
        const mostSoldServices = await ServiceOrder.aggregate([
            { $group: { _id: "$service", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Populate service details
        const populatedServices = await Service.populate(mostSoldServices, { path: "_id" });

        // Fetch ratings and reviews for each service
        const servicesWithRatings = await Promise.all(
            populatedServices.map(async (serviceData) => {
                const serviceId = serviceData._id._id; // Extract actual service ID

                // Fetch ratings & reviews from ServiceOrder
                const orders = await ServiceOrder.find({ service: serviceId }, { rating: 1, remarks: 1, _id: 0 });

                const ratings = orders.map(order => order.rating).filter(r => r !== undefined);
                const reviews = orders.map(order => order.remarks).filter(r => r !== undefined);

                const averageRating = ratings.length
                    ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
                    : null;

                return {
                    ...serviceData._id.toObject(), // Convert service model to object
                    total_bookings: serviceData.count,
                    rating: averageRating ? parseFloat(averageRating) : 5,
                    reviews,
                };
            })
        );
        return NextResponse.json({ services: servicesWithRatings });
    } catch (error) {
        console.error("Error fetching most sold services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
