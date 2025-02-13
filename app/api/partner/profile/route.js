import connectDB from "@/db/connect";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const data = await req.json();
  console.log(data);
  if (!data.pincode || data.pincode.length == 0)
    return NextResponse.json({ error: "Pincode array is absent!" });

  const user = await Partner.findByIdAndUpdate(
    userId,
    { pincode: data.pincode },
    { new: true }
  );
  return NextResponse.json(user);
};

export const PUT = async (req) => {
  await connectDB();

  const userId = req.headers.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();
  if (!data.pincode || !data.function) {
    return NextResponse.json(
      { error: "Pincode is not there!" },
      { status: 400 }
    );
  }

  let updateQuery = {};
  if (data.function === "ADD") {
    updateQuery = { $push: { pincode: data.pincode } };
  } else if (data.function === "DELETE") {
    updateQuery = { $pull: { pincode: data.pincode } };
  } else {
    return NextResponse.json({ error: "Invalid function" }, { status: 400 });
  }
  try {
    const updatedPartner = await Partner.findByIdAndUpdate(
      userId,
      updateQuery,
      { new: true }
    );

    if (!updatedPartner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json(updatedPartner, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
