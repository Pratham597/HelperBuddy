import { NextResponse } from "next/server";
import auth from "@/middlewares/auth.js";
import {
	verifyUser,
	verifyPartner,
	verifyAdmin,
} from "@/middlewares/roleVerify.js";

function parseCookies(req) {
	const cookieHeader = req.headers.get("cookie") || "";
	return Object.fromEntries(
		cookieHeader.split("; ").map((cookie) => {
			const [key, ...value] = cookie.split("=");
			return [key, value.join("=")];
		})
	);
}

// Middleware which authenticates any type of user!
export async function middleware(req) {
	const path = req.nextUrl.pathname;
	const method = req.method;
	const cookies = parseCookies(req);
	const arr = ["/api/user/login", "/api/partner/login", "/api/admin/login", "/api/user/complaint", "/api/user/sign-up", "/api/partner/sign-up", "/api/newsletter"];

	// API Authentication
	if (path.startsWith("/api")) {
		if (method === "GET" && path === "/api/newsletter") {
			const isAdmin = await verifyAdmin(cookies);
			if (!isAdmin) {
				return NextResponse.json(
					{ error: "Unauthorized access" },
					{ status: 403 }
				);
			}
			return NextResponse.next();
		}

		if (method !== "GET" && !arr.includes(path)) return auth(req);
		else if (path === "/api/partner/service") {
			return auth(req);
		} else if (path === "/api/partner") {
			return auth(req);
		} else return NextResponse.next();
	}

	if (path.startsWith("/_next")) return NextResponse.next();

	const isPartner = await verifyPartner(cookies);
	const isAdmin = await verifyAdmin(cookies);
  	const isUser = await verifyUser(cookies);
  
  
	// Publicly accessible routes
	const publicRoutes = [
		"/",
		"/user/login",
		"/user/cart",
		"/partner/login",
		"/admin/login",
		"/about",
		"/terms",
		"/policies",
	];

	if (
		publicRoutes.includes(path) ||
		path.startsWith("/services") ||
		path.startsWith("/blogs")
	) {
		if (
			isUser &&
			(path === "/user/login" ||
				path === "/partner/login" ||
				path === "/admin/login")
		)
			return NextResponse.redirect(new URL("/", req.url));

		if (isPartner)
			return NextResponse.redirect(
				new URL("/partner/dashboard", req.url)
			);
		if (isAdmin)
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		return NextResponse.next();
	}

	if (isUser && path.startsWith("/user")) return NextResponse.next();
	if (isPartner && path.startsWith("/partner")) return NextResponse.next();
	if (isAdmin && path.startsWith("/admin")) return NextResponse.next();

	// Redirect unauthorized access
	if (isPartner)
		return NextResponse.redirect(new URL("/partner/dashboard", req.url));
	if (isAdmin)
		return NextResponse.redirect(new URL("/admin/dashboard", req.url));
	if (isUser) return NextResponse.redirect(new URL("/", req.url));

	// If not logged in, redirect to login
	return NextResponse.redirect(new URL("/", req.url));
}

// export const config = {
// 	matcher: ["/:path*"],
// };
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|logo.png).*)",
  ],
};
