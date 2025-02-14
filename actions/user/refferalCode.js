import User from "@/models/User";
import connectDB from "@/db/connect";

const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) { 
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

const generateUniqueReferralCode = async () => {
    let referralCode;
    let isUnique = false;
    await connectDB();
    while (!isUnique) {
        referralCode = generateCode();
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) {
            isUnique = true; 
        }
    }
    return referralCode;
};
export { generateUniqueReferralCode,generateCode};