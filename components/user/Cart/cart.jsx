"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ShippingForm } from "./shipping-form"
import { Timeline } from "./timeline"

export default function Cart() {
  const [cart, setCart] = useState([])
  const [shippingAddress, setShippingAddress] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(storedCart)
  }, [])

  const formatTimelineString = (cart) => {
    return cart.map((item) => `${item.timeline.date}`).join(", ")
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`
  }

  const formatAddress = (shippingAddress) => {
    return `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}`
  }

  const formatContactDetails = (shippingAddress) => {
    return {
      name: shippingAddress.name,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
    }
  }

  const handleCheckout = async () => {
    const totalAmount = cart.reduce((sum, item) => sum + (item?.price || 0), 0)
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user.token || !user.id) {
      console.error("User not authenticated")
      return
    }

    const data = {
      totalAmount,
      address: formatAddress(shippingAddress), // Using formatted address
      contactDetails: formatContactDetails(shippingAddress),
      pincode: shippingAddress.pincode,// Using formatted contact details
      services: cart.map((item) => ({
        serviceId: item.id,
        timeline: formatDate(item.timeline.date),
        slot: item.timeline.slot, // Ensure the slot is passed correctly
      })),
    }

    const res = await fetch("/api/user/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    })
    // if (res.ok) {
    //   const { booking } = await res.json()
    //   localStorage.removeItem("cart")
    //   router.push(`/user/bookings/${booking._id}`)
    // }

    console.log(res)
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
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-black mb-8 text-center">🛒 Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <p className="text-2xl text-gray-500 mb-8">Your cart is empty. Let's add some amazing services!</p>
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
              <h2 className="text-2xl font-semibold mb-4">Your Selected Items</h2>
              <ScrollArea className="h-[calc(100vh-500px)]">
                <ul className="space-y-6">
                  {cart.map((item, index) => (
                    <li key={index} className="pb-4 border-b last:border-none animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-20 h-20 rounded-md object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                            <p className="text-md text-gray-600">₹{item.price.toFixed(2)}</p>
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
                      <Timeline timeline={item.timeline} onChange={(timeline) => updateItemTimeline(index, timeline)} />
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </Card>

            <Card className="shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl">
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

          <Card className="lg:w-1/3 shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
            <ShippingForm onSubmit={handleShippingSubmit} />
            {shippingAddress && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md animate-fadeIn">
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

      <div className="mt-8 text-center animate-slideInFromBottom">
        <Button
          className="w-full max-w-md bg-black text-white hover:bg-gray-800 text-lg py-6 transition-all duration-300 hover:shadow-lg"
          onClick={handleCheckout}
          disabled={!shippingAddress || cart.length === 0 || cart.some((item) => !item.timeline)}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}

