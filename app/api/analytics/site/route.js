import connectDB from "@/db/connect";
import Booking from "@/models/Booking";
import Partner from "@/models/Partner";
import Service from "@/models/Service";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectDB();
        const bookings = await Booking.countDocuments({ isPaid: true });
        const users = await User.countDocuments({});
        const partners = await Partner.countDocuments({ isApproved: "1" });
        const services = await Service.countDocuments({});

        return NextResponse.json({ bookings, users, partners, services }, { status: 200 });
    } catch (error) {
        console.error("Error fetching entity counts:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

