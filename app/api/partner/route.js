import Partner from "@/models/Partner";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";

/** Controller for fetching partner */
export const GET = async (req) => {
    await connectDB();
    const userId = req.headers.get('userId');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Admin can only fetch partner!
    const admin = await Admin.findById(userId);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const partners = await Partner.find().select('-password');
    return NextResponse.json(partners);
};