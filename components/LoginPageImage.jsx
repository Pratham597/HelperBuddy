"use client";

export default function LoginPageImage({IMAGE_URL, Heading, SubHeading}) {
    // console.log(IMAGE_URL);
	return (
		<div>
			<img
				src={IMAGE_URL }
				className="w-full h-full object-cover object-[60%]"
				alt="Cleaning Service"
			/>
			{/* Text Overlay */}
			<div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white px-6 text-center">
                <h1 className="text-4xl font-bold">{ Heading}</h1>
                <p className="mt-2 text-base">{ SubHeading }</p>
			</div>
		</div>
	);
}
