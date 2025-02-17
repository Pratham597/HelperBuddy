"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
	const pathname = usePathname();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}, [loading]);

	useEffect(() => {
		// Start loading when pathname changes
		setLoading(true);

		// Stop loading once route change is complete
		const timeout = setTimeout(() => setLoading(false), 500);

		return () => clearTimeout(timeout);
	}, [pathname]); // Watch for changes in the pathname

	const handleClick = (event) => {
		let target = event.target;

		// Find the nearest anchor tag (<a>)
		while (target && target.tagName !== "A") {
			target = target.parentElement;
		}

		// If no valid <a> tag found, exit
		if (!target || !target.href) return;

		// Extract the path (ignoring domain)
		const targetPath = new URL(target.href, window.location.origin)
			.pathname;

		// 🛑 Prevent progress bar if already on the same page
		if (targetPath === pathname) return;

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
