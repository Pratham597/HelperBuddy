// /** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"images.unsplash.com", // ✅ Keep this
			"plus.unsplash.com", // ✅ Needed for some Unsplash images
			"media.istockphoto.com",
			"cdn.zyrosite.com",
			"encrypted-tbn0.gstatic.com",
		],
	},
};

export default nextConfig;
