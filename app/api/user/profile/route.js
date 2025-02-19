import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/db/connect";

export const PATCH = async (req) => {
  try {
    let token;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new Error("Not authorized");
    }

    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User unauthorized" }, { status: 403 });
    }

    await connectDB();

    const { name, phone } = await req.json();

    if (!name && !phone) {
      return NextResponse.json(
        { error: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, phone } },
      { new: true, runValidators: true },
    ).select("name email phone token _id referralCode wallet");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully", user: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          token: token,
          id: updatedUser._id,
          referralCode: updatedUser.referralCode,
          wallet: updatedUser.wallet,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
};