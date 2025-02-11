"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cart, setCart] = useState([]); // Holds cart items
  const router = useRouter();

  // ✅ Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // ✅ Remove item from cart
  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage immediately
    window.dispatchEvent(new Event("storage")); // Sync across components
  };

  // ✅ Calculate total price safely
  const totalPrice = cart.reduce((sum, item) => sum + (item?.price || 0), 0);

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-black mb-4">🛒 Your Cart</h2>

      {/* Empty Cart Message */}
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty. Add services to proceed.</p>
      ) : (
        <Card className="w-full max-w-lg shadow-lg p-6 rounded-lg bg-white">
          <ScrollArea className="h-80">
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 border-b last:border-none"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-md font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>

          <Separator className="my-4" />

          {/* Total Price & Checkout */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-black">Total: ₹{totalPrice}</p>
            <Button
              className="bg-black text-white px-6 py-2 hover:bg-gray-800"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
