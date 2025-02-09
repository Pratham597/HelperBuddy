import { SignJWT } from "jose";

const generateToken = async (id) => {
  const secret = new TextEncoder().encode(process.env.NEXT_KEY_SECRET);

  return await new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
};

export default generateToken;
