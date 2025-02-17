"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
	const pathname = usePathname(); // Detects route changes
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}, [loading]);

	useEffect(() => {
		// When pathname changes, stop loading
		setLoading(false);
	}, [pathname]);

	const handleClick = (event) => {
		let target = event.target;

		// Traverse up the DOM tree to check if the clicked element is inside a <a> tag
		while (target && target.tagName !== "A") {
			target = target.parentElement;
		}

		if (target && target.href) {
			// If the clicked <a> tag has an href, start loading
			setLoading(true);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return null;
}
