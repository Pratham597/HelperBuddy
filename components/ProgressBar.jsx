"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
	const pathname = usePathname();

	useEffect(() => {
		NProgress.start();
		const timer = setTimeout(() => {
			NProgress.done();
		}, 500); // Delay to ensure visibility
		console.log("Progress Bar is running");
		return () => {
			clearTimeout(timer);
			NProgress.done();
		};
	}, [pathname]); // Runs when the route changes

	return null;
}
