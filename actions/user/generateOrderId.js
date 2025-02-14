import Razorpay from "razorpay";
const initate = async (amount) => {
  var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  let paymentData = {
    amount: parseInt(amount)*100,
    currency: "INR",
  };
  
  let res = await razorpay.orders.create(paymentData);
  
  return res.id;
};
export default initate;
