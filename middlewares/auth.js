import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export const verifyToken = async (token) => {
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_KEY_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
const auth = async (req) => {
  let token;
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = await verifyToken(token);

      const res = NextResponse.next();
      res.headers.set("userId", decoded.id);

      return res;
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 400 });
    }
  }
  if (!token) {
    throw new Error("Not authorized");
  }
};
export default auth;
