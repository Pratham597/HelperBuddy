"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import axios from "axios"

export function ShippingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [unavailableItems, setUnavailableItems] = useState([])
  const [availabilityMessage, setAvailabilityMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [isPincodeVerified, setIsPincodeVerified] = useState(false)

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      if (storedUser) {
        setFormData((prevData) => ({
          ...prevData,
          name: storedUser.name || "",
          email: storedUser.email || "",
          phone: storedUser.phone.slice(-10) || "",
        }))
      }
    } catch (error) {
      console.error("Error loading user details:", error)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "city" && {
        state: value === "Surat" ? "Gujarat" : value === "Mumbai" ? "Maharashtra" : "",
      }),
    }))
    setFormError("")
    if (name === "pincode") {
      setIsPincodeVerified(false)
      setAvailabilityMessage("")
    }
  }

  const handleAvailability = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const unavailable = [];
  
    setIsLoading(true);
    setAvailabilityMessage("");
  
    try {
      await Promise.all(
        cart.map(async (item) => {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_URL}/api/service/${item.id}/available?pincode=${formData.pincode}`
            );
            
            if (!res.data.available) {
              unavailable.push(item.name);
            }
          } catch (error) {
            console.error(`Error checking availability for ${item.name}:`, error);
            unavailable.push(item.name);
          }
        })
      );
  
      if (unavailable.length > 0) {
        setUnavailableItems(unavailable);
        setAvailabilityMessage(`The following items are not available at this pincode: ${unavailable.join(", ")}`);
        setIsPincodeVerified(false);
      } else {
        setUnavailableItems([]);
        setAvailabilityMessage("All items are available at this pincode.");
        setIsPincodeVerified(true);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailabilityMessage("Error checking availability. Please try again.");
      setIsPincodeVerified(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if any required field is empty
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"]
    const emptyFields = requiredFields.filter((field) => !formData[field])

    if (emptyFields.length > 0) {
      setFormError(`Please fill in all required fields: ${emptyFields.join(", ")}`)
      return
    }

    if (!isPincodeVerified) {
      setFormError("Please verify the pincode before saving the address.")
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" pattern="[0-9]{10}" value={formData.phone}  maxLength={10} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="mb-4">
        <Label htmlFor="city">City</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full text-left">
              {formData.city || "Select City"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem onClick={() => setFormData((prev) => ({ ...prev, city: "Surat", state: "Gujarat" }))}>
              Surat
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFormData((prev) => ({ ...prev, city: "Mumbai", state: "Maharashtra" }))}
            >
              Mumbai
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" value={formData.state} readOnly />
      </div>

      <div>
        <Label htmlFor="pincode">Pincode</Label>
        <div className="flex gap-2">
          <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} required />
          <Button type="button" onClick={handleAvailability} disabled={isLoading || !formData.pincode}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
          </Button>
        </div>
        {availabilityMessage && (
          <p className={`mt-2 text-sm ${unavailableItems.length > 0 ? "text-red-600" : "text-green-600"}`}>
            {availabilityMessage}
          </p>
        )}
      </div>

      {formError && <p className="text-red-600 text-sm">{formError}</p>}

      <Button
        type="submit"
        className="w-full my-5 bg-black text-white hover:bg-gray-800"
        disabled={!isPincodeVerified || isLoading}
      >
        Save Address
      </Button>
    </form>
  )
}

