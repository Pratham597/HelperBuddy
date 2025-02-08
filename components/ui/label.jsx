export function Label({ className, ...props }) {
	return (
		<label
			className={`block font-medium text-gray-700 ${className}`}
			{...props}
		/>
	);
}
