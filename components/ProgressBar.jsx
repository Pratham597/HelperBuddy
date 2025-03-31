"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";


NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
	const pathname = usePathname();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}, [loading]);

	useEffect(() => {
		const prevPath = sessionStorage.getItem("prevPath");

		// Skip progress bar when navigating between /services and /services/[slug]
		const isWithinServices =
			prevPath?.startsWith("/services") &&
			pathname.startsWith("/services");

		if (!isWithinServices) {
			setLoading(true);
		}

		// Store the previous path for comparison
		sessionStorage.setItem("prevPath", pathname);

		// Stop loading after a delay
		const timeout = setTimeout(() => setLoading(false), 500);

		return () => clearTimeout(timeout);
	}, [pathname]);

	const handleClick = (event) => {
		let target = event.target;

		while (target && target.tagName !== "A") {
			target = target.parentElement;
		}

		if (!target || !target.href) return;

		const targetPath = new URL(target.href, window.location.origin)
			.pathname;

		// Skip progress bar when navigating within /services
		if (
			targetPath.startsWith("/services") &&
			pathname.startsWith("/services")
		) {
			return;
		}

		if (
			pathname === targetPath ||
			(targetPath.startsWith("/services") && pathname.startsWith("/services"))
		) {
			return;
		}

		setLoading(true);
	};

	useEffect(() => {
		document.body.addEventListener("click", handleClick);
		return () => {
			document.body.removeEventListener("click", handleClick);
		};
	}, [pathname]);

	return null;
}
