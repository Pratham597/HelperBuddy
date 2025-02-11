import Razorpay from "razorpay";
import connectDB from "@/db/connect";
const initate = async (amount) => {
  await connectDB();
  var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  let paymentData = {
    amount: parseInt(amount),
    currency: "INR",
  };

  let res = await razorpay.orders.create(paymentData);
  return res.id;
};
export default initate;
