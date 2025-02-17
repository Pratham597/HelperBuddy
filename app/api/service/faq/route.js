import Admin from "@/models/Admin";
import Faq from "@/models/Faq";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";

export const POST = async (req) => {
  try {
    await connectDB();

    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User not authorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { question, answer, service_id } = data;

    if (!question?.trim() || !answer?.trim() || !service_id?.trim()) {
      return NextResponse.json(
        { error: "Required fields are empty" },
        { status: 400 }
      );
    }

    const adminUser = await Admin.findById(userId);
    if (!adminUser) {
      return NextResponse.json(
        { error: "Only Admins are allowed" },
        { status: 403 }
      );
    }

    const service = await Service.findById(service_id);
    if (!service) {
      return NextResponse.json(
        { error: "Service not found!" },
        { status: 404 }
      );
    }

    const faq = new Faq({
      user: adminUser._id,
      question,
      answer,
      service: service_id,
    });
    await faq.save();

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");

    if (!service?.trim()) {
      return NextResponse.json(
        { error: "Service ID is required!" },
        { status: 400 }
      );
    }

    const faq = await Faq.find({ service });

    return NextResponse.json(
      { success: true, faq: faq || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
