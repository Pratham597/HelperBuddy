"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function ServiceDetails({ service, onClose }) {
  const [pincode, setPincode] = useState("")
  const [availabilityMessage, setAvailabilityMessage] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false) 
  const router = useRouter();

  const checkAvailability = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/service/${service._id}/available?pincode=${pincode}`);
      if (!res.ok) throw new Error("Failed to fetch availability");
      const data = await res.json();
      setAvailabilityMessage(data.error || data.success);
    } catch (error) {
      console.error(error);
      setAvailabilityMessage("Error checking availability");
    } finally{
      setLoading(false)
    }
  };

  const addToCart = () => {
    if (!service) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    cart.push({
      id: service._id,
      name: service.name,
      price: service.price,
      image: service.image,
    })
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("storage")); // to get instant update of cart count on cart icon - Smit
    router.push('/user/cart')
  }

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <Button
        variant="outline"
        onClick={onClose}
        className="absolute 
              top-2 right-2  text-white bg-red-600 hover:bg-red-700 border-none p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
      >
        ✖
      </Button>
      <Card className="w-full max-w-6xl shadow-lg flex flex-col md:flex-row overflow-hidden">
      
        <div className="w-full md:w-2/5 bg-gray-100 flex items-center justify-center p-4 md:p-6">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-auto max-h-[300px] md:max-h-full object-cover rounded-lg shadow-md"
          />
        </div>

        <ScrollArea className="w-full md:w-3/5 h-[60vh] md:h-[80vh] p-4 md:p-6">
        
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-black">{service.name}</h2>
            
          </div>

          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          <p className="text-lg font-semibold text-black mb-4">₹{service.price}</p>

          <Separator className="my-4 bg-gray-200" />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check Availability:</label>
            <div className="flex items-center">
              <Input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="border-gray-300 text-sm flex-grow mx-2"
                maxLength={6}

              />
              <Button
                variant="outline"
                onClick={checkAvailability}
                disabled={loading}
                className="ml-2 bg-black text-white text-sm whitespace-nowrap hover:bg-gray-300 hover:border-black hover:text-black"
              >
              {  loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Check"}
              </Button>
            </div>
            {availabilityMessage && (
              <p className={`mt-2 text-sm ${availabilityMessage.includes("not") ? "text-red-600" : "text-green-600"}`}>
                {availabilityMessage}
              </p>
            )}
          </div>

          <Separator className="my-4 bg-gray-200" />

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-2">FAQs</h3>
            <ScrollArea className="h-40 border border-gray-200 rounded-md p-3">
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <strong>Q:</strong> How long does the service take?
                </li>
                <li>
                  <strong>A:</strong> Typically, it takes around 2-3 hours depending on the service.
                </li>
                <li>
                  <strong>Q:</strong> What is the cancellation policy?
                </li>
                <li>
                  <strong>A:</strong> Free cancellations up to 24 hours before the service.
                </li>
                <li>
                  <strong>Q:</strong> Are materials included?
                </li>
                <li>
                  <strong>A:</strong> Yes, all necessary materials are included in the price.
                </li>
              </ul>
            </ScrollArea>
          </div>

          <Separator className="my-4 bg-gray-200" />

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-2">Customer Feedback</h3>
            <ScrollArea className="h-40 border border-gray-200 rounded-md p-3">
              <div className="space-y-2">
                <Card className="bg-gray-50 border border-gray-200 p-3 rounded">
                  <p className="text-gray-600 text-sm">"Amazing service! The team was professional and on time."</p>
                  <p className="text-right text-gray-500 text-xs">- Rohan M.</p>
                </Card>
                <Card className="bg-gray-50 border border-gray-200 p-3 rounded">
                  <p className="text-gray-600 text-sm">"Very affordable and efficient! Highly recommended."</p>
                  <p className="text-right text-gray-500 text-xs">- Priya K.</p>
                </Card>
                <Card className="bg-gray-50 border border-gray-200 p-3 rounded">
                  <p className="text-gray-600 text-sm">"Excellent service quality. Will definitely use again!"</p>
                  <p className="text-right text-gray-500 text-xs">- Amit S.</p>
                </Card>
                <Card className="bg-gray-50 border border-gray-200 p-3 rounded">
                  <p className="text-gray-600 text-sm">"Prompt and courteous. Exceeded my expectations."</p>
                  <p className="text-right text-gray-500 text-xs">- Neha R.</p>
                </Card>
                <Card className="bg-gray-50 border border-gray-200 p-3 rounded">
                  <p className="text-gray-600 text-sm">"Great value for money. Highly satisfied with the results."</p>
                  <p className="text-right text-gray-500 text-xs">- Vikram P.</p>
                </Card>
              </div>
            </ScrollArea>
          </div>

          <Separator className="my-4 bg-gray-200" />

          <div className="mb-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              Leave Your Feedback:
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience..."
              className="w-full border-gray-300 text-sm"
              rows={3}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={()=>{addToCart(),onClose()}} className="bg-black text-white text-sm px-6 py-2 hover:bg-gray-800">Add to Cart</Button>
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

