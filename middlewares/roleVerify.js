const SECRET_KEY = new TextEncoder().encode(process.env.NEXT_PUBLIC_ROLE_KEY);

async function hashRole(role, salt) {
	const data = new TextEncoder().encode(role + salt);
	const key = await crypto.subtle.importKey(
		"raw",
		SECRET_KEY,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const signature = await crypto.subtle.sign("HMAC", key, data);
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

export async function verifyUser(cookies) {

	if (!cookies || !cookies.salt || !cookies.role) return false;
	
	const salt = cookies.salt;
	const storedHash = cookies.role;

	if (!salt || !storedHash) return false;

	const computedHash = await hashRole("user", salt);
	return computedHash === storedHash;
}

export async function verifyPartner(cookies) {

	if (!cookies || !cookies.salt || !cookies.role) return false;
	const salt = cookies.salt;
	const storedHash = cookies.role;
	
	if (!salt || !storedHash) return false;
	
	const computedHash = await hashRole("partner", salt);
	return computedHash === storedHash;
}

export async function verifyAdmin(cookies) {

	if (!cookies || !cookies.salt || !cookies.role) return false;
	const salt = cookies.salt;
	const storedHash = cookies.role;
	
	if (!salt || !storedHash) return false;
	
	const computedHash = await hashRole("admin", salt);
	return computedHash === storedHash;
}
