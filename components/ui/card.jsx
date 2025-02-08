export function Card({ className, children }) {
	return (
		<div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
			{children}
		</div>
	);
}

export function CardHeader({ className, children }) {
	return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardContent({ className, children }) {
	return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className, children }) {
	return (
		<h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>
	);
}
