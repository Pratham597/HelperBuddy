import Partner from "@/models/Partner";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";

/** Controller for approving partner */
export const POST = async (req, { params }) => {
    await connectDB();
    const userId = req.headers.get('userId');
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const admin = await Admin.findById(userId);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const partner = await Partner.findById(id);
    if (!partner) {
        return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    let data = await req.json();
    partner.isApproved = data.isApproved;
    await partner.save();
    return NextResponse.json({ message: "Partner checked by admin successfully!" });
}
