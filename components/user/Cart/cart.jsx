"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ShippingForm } from "./shipping-form"
import Navbar from "@/components/Navbar"
import { Timeline } from "./timeline"

export default function Cart() {
  const [cart, setCart] = useState([])
  const [shippingAddress, setShippingAddress] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(storedCart)
  }, [])

  const handleCheckout = async () => {
    const totalAmount = cart.reduce((sum, item) => sum + (item?.price || 0), 0)
    const data = cart.map((item) => ({
      serviceId: item._id,
      timeline: item.timeline,
      address: item.address,
      pincode: item.pincode,
    }))
    const res = await fetch("/api/user/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: localStorage.getItem("user"),
      },
      body: JSON.stringify({ data, totalAmount }),
    })
    if (res.ok) {
      const { booking } = await res.json()
      localStorage.removeItem("cart")
      router.push(`/user/bookings/${booking._id}`)
    }
  }

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("storage"))
  }

  const updateItemTimeline = (index, timeline) => {
    const updatedCart = [...cart]
    updatedCart[index].timeline = timeline
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item?.price || 0), 0)
  const calculateTax = () => totalPrice * 0.18
  const calculateTotal = () => totalPrice + calculateTax()

  const handleShippingSubmit = (formData) => {
    setShippingAddress(formData)
  }

  return (
  <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-black mb-8 text-center">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty. Add services to proceed.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <Card className="shadow-lg rounded-lg bg-white p-6">
                <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
                <ScrollArea className="h-[calc(100vh-500px)]">
                  <ul className="space-y-6">
                    {cart.map((item, index) => (
                      <li key={index} className="pb-4 border-b last:border-none">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              className="w-20 h-20 rounded-md object-cover"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                              <p className="text-md text-gray-600">₹{item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </Button>
                        </div>
                        <Timeline
                          timeline={item.timeline}
                          onChange={(timeline) => updateItemTimeline(index, timeline)}
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </Card>

              <Card className="shadow-lg rounded-lg bg-white p-6">
                <h2 className="text-2xl font-semibold mb-4">Bill Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-semibold">₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="lg:w-1/3 shadow-lg rounded-lg bg-white p-6">
              <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
              <ShippingForm onSubmit={handleShippingSubmit} />
              {shippingAddress && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="font-semibold mb-2">Saved Address:</h3>
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            className="w-full max-w-md bg-black text-white hover:bg-gray-800 text-lg py-6"
            onClick={handleCheckout}
            disabled={!shippingAddress || cart.length === 0 || cart.some((item) => !item.timeline)}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </>
  )
}

