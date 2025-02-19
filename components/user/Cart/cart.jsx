"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ShippingForm } from "./shipping-form";
import { Timeline } from "./timeline";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Script from "next/script";
import axios from "axios";
import { useIsMobile } from "@/hooks/use-mobile";
import PaymentStatusModal from "@/components/user/Cart/payment-status-modal";
import { delay } from "framer-motion";
import toast from "react-hot-toast";
import { set } from "lodash";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletAmount, setWalletAmount] = useState(0);
  const [walletUsed, setWalletUsed] = useState(0);
  const [walletError, setWalletError] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const fetchWalletBalance = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.token) {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/wallet`, {}, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setWalletAmount(response.data.wallet || 0);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    setWalletError("");
    setWalletUsed(0);
  }, [paymentMethod]);

  useEffect(() => {
    if (paymentMethod === "Wallet+Online") {
      validateWalletAmount(walletUsed);
    }
  }, [walletUsed]);

  const validateWalletAmount = (amount) => {
    const numAmount = Number(amount);
    const total = calculateTotal();

    setWalletError("");

    if (numAmount > walletAmount) {
      setWalletError(`Amount cannot exceed wallet balance of ₹${walletAmount}`);
      return false;
    }

    if (numAmount >= total) {
      setWalletError(`Amount must be less than total order amount. Maximum allowed: ₹${(total - 1).toFixed(2)}`);
      return false;
    }

    if (numAmount < 0) {
      setWalletError("Amount cannot be negative");
      return false;
    }

    return true;
  };

  const handleWalletAmountChange = (e) => {
    const amount = e.target.value;
    setWalletUsed(amount);
  };

  const formatTimelineString = (cart) => {
    return cart.map((item) => `${item.timeline.date}`).join(", ");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatAddress = (shippingAddress) => {
    return `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}`;
  };

  const formatContactDetails = (shippingAddress) => {
    return {
      name: shippingAddress.name,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
    };
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      let totalAmount = cart.reduce((sum, item) => sum + (item?.price || 0), 0);
      totalAmount += totalAmount * 0.18;
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token || !user.id) {
        toast.error("Please login to continue");
        await delay(500);
        router.push("/user/login");
        return;
      }
      const data = {
        totalAmount,
        address: formatAddress(shippingAddress),
        contactDetails: formatContactDetails(shippingAddress),
        pincode: shippingAddress.pincode,
        services: cart.map((item) => ({
          serviceId: item.id,
          timeline:
            formatDate(item.timeline.date) + " " + item.timeline.timeSlot,
        })),
        // paymentMethod,
        // walletUsed: paymentMethod === "Wallet+Online" ? Number(walletUsed) : 0
      };
      // if (paymentMethod === "COD") {
      //   const res = await axios.post(
      //     `${process.env.NEXT_PUBLIC_URL}/api/user/checkout`,
      //     data,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${user.token}`,
      //       },
      //     }
      //   );
      //   if (res.data.success) {
      //     setPaymentStatus("success");
      //     setIsModalOpen(true);
      //     setCart([]);
      //     localStorage.removeItem("cart");
      //     window.dispatchEvent(new Event("storage"));
      //   }
      // } else {
      //   const res = await axios.post(
      //     `${process.env.NEXT_PUBLIC_URL}/api/user/checkout`,
      //     data,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${user.token}`,
      //       },
      //     }
      //   );

      //   // if (res.status === 200) {
      //   //   const { booking } = res.data;
      //   //   const orderId = booking.orderId;
      //   //   const options = {
      //   //     key: process.env.RAZORPAY_KEY_ID,
      //   //     amount: Number(booking.totalAmount) * 100,
      //   //     currency: "INR",
      //   //     name: `HelperBuddy Services`,
      //   //     description: "Order Payment",
      //   //     image: "./avatar.gif",
      //   //     order_id: orderId,
      //   //     prefill: {
      //   //       name: user.name,
      //   //       email: user.email,
      //   //       contact: user.phone,
      //   //     },
      //   //     notes: {
      //   //       address: "Razorpay Corporate Office",
      //   //     },
      //   //     theme: {
      //   //       color: "#3399cc",
      //   //     },
      //   //     handler: async (response) => {
      //   //       try {
      //   //         setPaymentStatus("processing");
      //   //         setIsModalOpen(true);

      //   //         const res = await fetch(
      //   //           `${process.env.NEXT_PUBLIC_URL}/api/user/payment`,
      //   //           {
      //   //             method: "POST",
      //   //             headers: {
      //   //               "Content-Type": "application/json",
      //   //               Authorization: `Bearer ${user.token}`,
      //   //             },
      //   //             body: JSON.stringify({
      //   //               razorpay_payment_id: response.razorpay_payment_id,
      //   //               razorpay_order_id: response.razorpay_order_id,
      //   //               razorpay_signature: response.razorpay_signature,
      //   //             }),
      //   //           }
      //   //         );

      //   //         const data = await res.json();
      //   //         if (data.success) {
      //   //           setPaymentStatus("success");
      //   //           setCart([]);
      //   //           localStorage.removeItem("cart");
      //   //           window.dispatchEvent(new Event("storage"));
      //   //           try {
      //   //             await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/postPayment`, {
      //   //               method: "POST",
      //   //               headers: {
      //   //                 "Content-Type": "application/json",
      //   //                 Authorization: `Bearer ${user.token}`,
      //   //               },
      //   //               body: JSON.stringify(
      //   //                 { booking: data.booking }
      //   //               ),
      //   //             });
      //   //           } catch (error) {
      //   //             console.error("Sending emails failed!")
      //   //           }
      //   //         } else {
      //   //           setPaymentStatus("error");
      //   //         }
      //   //       } catch (error) {
      //   //         console.error("Payment verification error:", error);
      //   //         setPaymentStatus("error");
      //   //       } finally {
      //   //         setIsLoading(false);
      //   //       }
      //   //     },
      //   //     modal: {
      //   //       ondismiss: () => {
      //   //         setIsLoading(false); // Stop loading
      //   //         setPaymentStatus("error"); // Mark as error since payment is canceled
      //   //         setIsModalOpen(true); // Open the payment status modal with failure status
      //   //       },
      //   //     },
      //   //   };

      //   //   const rzp1 = new window.Razorpay(options);
      //   //   rzp1.open();
      //   // } else {
      //   //   alert("Error Occurred! Try again later");
      //   //   setIsLoading(false);
      //   // }
      // }
      console.log(data.services);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/order`, data  ,{
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (res.data.success) {
          setPaymentStatus("success");
          setIsModalOpen(true);
          setCart([]);
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("storage"));
          router.push("/user/dashboard/bookings/servicesPending");
          setIsLoading(false);
        }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
      setIsLoading(false);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const updateItemTimeline = (index, timeline) => {
    const updatedCart = [...cart];
    console.log(timeline);
    updatedCart[index].timeline = timeline;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item?.price || 0), 0);
  const calculateTax = () => totalPrice * 0.18;
  const calculateTotal = () => totalPrice + calculateTax();

  const handleShippingSubmit = (formData) => {
    setShippingAddress(formData);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className="container mx-auto px-4 py-8 animate-fadeIn mt-20">
        <h1 className="text-4xl font-bold text-black mb-8 text-center">
          🛒 Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <p className="text-2xl text-gray-500 mb-8">
              Your cart is empty. Let's add some amazing services!
            </p>
            <Button
              className="bg-black text-white hover:bg-gray-800 text-lg py-3 px-6"
              onClick={() => router.push("/services")}
            >
              Explore Services
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 animate-slideInFromBottom">
            <div className="flex-1 space-y-8">
              <Card className="shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-semibold mb-4">
                  Your Selected Items
                </h2>
                {isMobile && (
                  <ScrollArea className="h-[calc(100vh-500px)]">
                    <ul className="space-y-6">
                      {cart.map((item, index) => (
                        <li
                          key={index}
                          className="pb-4 border-b last:border-none animate-fadeIn"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                className="w-20 h-20 rounded-md object-cover transition-transform duration-300 hover:scale-105"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-black">
                                  {item.name}
                                </h3>
                                <p className="text-md text-gray-600">
                                  ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              className="transition-colors duration-300 hover:bg-red-100"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </Button>
                          </div>
                          <Timeline
                            timeline={item.timeline}
                            onChange={(timeline) =>
                              updateItemTimeline(index, timeline)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
                {!isMobile && (
                  <ScrollArea className="h-[calc(100vh-500px)]">
                    <ul className="space-y-6">
                      {cart.map((item, index) => (
                        <li
                          key={index}
                          className="pb-4 border-b last:border-none animate-fadeIn"
                        >
                          {/* Top Section: Image, Name, Price, and Delete Button */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  item.image ||
                                  "/placeholder.jpg" ||
                                  "/placeholder.svg"
                                }
                                alt={item.name}
                                className="w-20 h-20 rounded-md object-cover transition-transform duration-300 hover:scale-105"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-black">
                                  {item.name}
                                </h3>
                                <p className="text-md text-gray-600">
                                  ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Date Picker, Timeline, and Delete Button in One Row */}
                            <div className="flex items-center space-x-4">
                              <Timeline
                                timeline={item.timeline}
                                onChange={(timeline) =>
                                  updateItemTimeline(index, timeline)
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                                className="transition-colors duration-300 hover:bg-red-100"
                              >
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </Card>
              {/* <Card className="shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl mt-4">
                <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Online">Online Payment</SelectItem>
                      {walletAmount > 0 && (
                        <SelectItem value="Wallet+Online">Wallet + Online Payment (Balance: ₹{walletAmount})</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {paymentMethod === "Wallet+Online" && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Enter amount to use from wallet</label>
                      <Input
                        type="number"
                        value={walletUsed}
                        onChange={handleWalletAmountChange}
                        max={Math.min(walletAmount, calculateTotal())}
                        min={0}
                        className="w-full"
                      />
                      {walletError && (
                        <Alert variant="destructive">
                          <AlertDescription>{walletError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {paymentMethod === "Wallet+Online" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Amount:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Wallet Amount Used:</span>
                        <span>₹{walletUsed}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Amount to Pay Online:</span>
                        <span>₹{calculateTotal() - walletUsed}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card> */}

              <Card className="shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-semibold mb-4">Bill Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-semibold">
                      ₹{calculateTax().toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="lg:w-1/3 shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
              <ShippingForm onSubmit={handleShippingSubmit} />
              {shippingAddress && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md animate-fadeIn">
                  <h3 className="font-semibold mb-2">Saved Address:</h3>
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} -{" "}
                    {shippingAddress.pincode}
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        <div className="mt-8 text-center animate-slideInFromBottom">
          <Button
            className="w-full max-w-md bg-black text-white hover:bg-gray-800 text-lg py-6 transition-all duration-300 hover:shadow-lg"
            onClick={handleCheckout}
            disabled={
              !shippingAddress ||
              cart.length === 0 ||
              cart.some((item) => !item.timeline) ||
              isLoading
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Place your Order`
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
