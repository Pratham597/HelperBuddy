"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import ServiceDetails from "./service-details"
import { poppins } from "../fonts/font"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ServiceDetailsContent({ slug, onClose }) {
  const [service, setService] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchService = async () => {
      try {
        setError(null)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/service/${slug}`, { signal: controller.signal })
        if (res.data) {
          setService(res.data)
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Failed to fetch service details.")
          console.error("Error fetching service:", error)
        }
      }
    }

    fetchService()
    return () => controller.abort()
  }, [slug])

  return (
    <div
      className={`fixed inset-0 bg-gray-400 bg-opacity-90 flex items-center justify-center z-50 p-4 ${poppins.variable} font-sans`}
    >
      <div className="relative w-full max-w-6xl">
        <Button
          variant="outline"
          onClick={onClose}
          className="absolute top-5 right-5 text-white bg-red-600 hover:bg-red-700 border-none p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10"
        >
          ✖
        </Button>
        {!service ? (
          <div className="flex justify-center items-center h-96 bg-white rounded-lg">
            <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center bg-white p-4 rounded-lg">{error}</div>
        ) : (
          <ServiceDetails service={service} onAddToCart={onClose} />
        )}
      </div>
    </div>
  )
}

