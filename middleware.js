import { NextResponse } from "next/server";
import auth from "@/middlewares/auth.js";

// Middleware which auth the any type of user!
export function middleware(req) {
  const path = req.nextUrl.pathname;
  const method = req.method;
  const arr = [
    "/api/user/login",
    "/api/user/sign-up",
    "/api/partner/login",
    "/api/partner/sign-up",
    "/api/admin/login",
    "/api/admin/sign-up",
  ];
  if (method == "POST" && !arr.includes(path)  ) {
    return auth(req);
  } else return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: ["/api/:path*"],
};
