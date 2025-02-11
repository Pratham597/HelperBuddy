"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
  useEffect(() => {
    const loadUserDetails = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const data = JSON.parse(storedUser) 
          setFormData((prevData) => ({
            ...prevData,
            name: data.name,
            email: data.email,
            phone:data.phone,
          }))
        }
      } catch (error) {
        console.error("Error loading user details:", error)
      }
    }
  
    loadUserDetails()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "city" && {
        state: value === "Surat" ? "Gujarat" : value === "Mumbai" ? "Maharashtra" : "",
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
  <>
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
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>
        
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div className="mb-4">
  <Label htmlFor="city" className="block text-sm font-medium text-gray-700">City</Label>
  
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full text-left">
        {formData.city || "Select City"}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-full">
      <DropdownMenuItem onClick={() => handleChange({ target: { name: "city", value: "Surat" } })}>
        Surat
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleChange({ target: { name: "city", value: "Mumbai" } })}>
        Mumbai
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>


      <div>
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" value={formData.state} onChange={handleChange}  required readOnly />
      </div>

        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
        </div>
    </form>
  </>
    
  )
}

