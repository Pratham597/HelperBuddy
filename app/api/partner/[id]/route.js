import Partner from "@/models/Partner";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";

/** Controller for fetching particular partner */
export const GET = async (req, { params }) => {
    const { id } = await params;
    await connectDB();
    const userId = req.headers.get('userId');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Admin can only fetch partner!
    const admin = await Admin.findById(userId);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const partner = await Partner.findById(id).select('-password');
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    return NextResponse.json(partner);
};

export const DELETE = async (req, { params }) => {
    const { id } = params;
    await connectDB();

    const userId = req.headers.get('userId');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Only admin can delete a partner
    const admin = await Admin.findById(userId);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const partner = await Partner.findById(id);
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    partner.isApproved = -1;
    await partner.save();

    return NextResponse.json({ message: "Partner account deactivated successfully" });
};