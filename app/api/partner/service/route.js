import PartnerService from "@/models/PartnerService";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import Service from "@/models/Service"

/** Controller for creating service under partner */
export const POST = async (req) => {
    await connectDB();
    const userId = req.headers.get("userId");
    let data = await req.json();

    const user = await Partner.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 403 });
    }
    if (user.isApproved !== "1") {
        return NextResponse.json({ error: "User not approved" }, { status: 403 });
    }
    if (!data.serviceId) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const partnerservice = await PartnerService.findOne({ partner: userId, service: data.serviceId });
    if (partnerservice) return NextResponse.json({ error: "Service already exists!" }, { status: 403 });

    const service = await PartnerService.create({
        partner: userId,
        service: data.serviceId,
    });

    const services = await PartnerService.find({ partner: userId, service: data.serviceId }).populate("service");
    return NextResponse.json({ success: true, services });
}

/** Controller for getting services under partner */
export const GET = async (req) => {
    await connectDB();
    const userId = req.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 403 });
    const user = await Partner.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 403 });
    }
    if (user.isApproved === "0" || user.isApproved === "-1") {
        return NextResponse.json({ error: "User not approved" }, { status: 403 });
    }
    const services = await PartnerService.find({ partner: userId }).populate('service');
    return NextResponse.json({ services });
}

/** Controller for deleting service under partner */
export const DELETE = async (req) => {
    await connectDB();
    const userId = req.headers.get("userId");
    let data = await req.json();

    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 403 });
    const user = await Partner.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 403 });
    }
    if (user.isApproved !== "1") {
        return NextResponse.json({ error: "User not approved" }, { status: 403 });
    }
    if (!data.serviceId) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const partnerservice = await PartnerService.findOneAndDelete({ partner: userId, service: data.serviceId });
    if (!partnerservice) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const services = await PartnerService.find({ partner: userId }).populate("service");
    return NextResponse.json({ success: true, services });
};