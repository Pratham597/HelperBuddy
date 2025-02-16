"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/service-card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import ServiceDetailsContent from "@/components/user/serviceDetailsContent"
import { poppins } from "../fonts/font"

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceFilter, setPriceFilter] = useState({ type: "none", min: 0, max: 10000 })
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/service`)
        setServices(res.data)
      } catch (error) {
        console.error("Failed to fetch services", error)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    if (params.id) {
      setSelectedServiceId(params.id)
    }
  }, [params.id])

  const allCategories = [...new Set(services.map((service) => service.category))]

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const filteredServices = services.filter((service) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(service.category)

    const priceMatch =
      service.price >= priceFilter.min && service.price <= priceFilter.max

    return categoryMatch && priceMatch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (priceFilter.type === "asc") return a.price - b.price
    if (priceFilter.type === "desc") return b.price - a.price
    return 0
  })

  const groupedServices = sortedServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push(service)
    return acc
  }, {})

  const handleServiceClick = (serviceId) => {
    setSelectedServiceId(serviceId)
    router.push(`/services/${serviceId}`, undefined, { shallow: true })
  }

  const handleCloseDetails = () => {
    setSelectedServiceId(null)
    router.push("/services", undefined, { shallow: true })
  }

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${poppins.variable} font-sans`}>
      <main className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>

          {/* Category Filter */}
          <div className="mb-4">
            <h3 className="text-md font-semibold">Categories</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  onClick={() => toggleCategory(category)}
                  className="px-3 py-1"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-4">
            <h3 className="text-md font-semibold">Price</h3>
            <div className="flex gap-2 mt-2">
              <Button
                variant={priceFilter.type === "asc" ? "default" : "outline"}
                onClick={() => setPriceFilter((prev) => ({ ...prev, type: "asc" }))}
              >
                Low to High
              </Button>
              <Button
                variant={priceFilter.type === "desc" ? "default" : "outline"}
                onClick={() => setPriceFilter((prev) => ({ ...prev, type: "desc" }))}
              >
                High to Low
              </Button>
            </div>

            {/* Price Range */}
            <div className="flex gap-4 mt-2">
              <input
                type="number"
                value={priceFilter.min}
                onChange={(e) => setPriceFilter((prev) => ({ ...prev, min: Number(e.target.value) }))}
                className="border p-2 w-20 rounded"
                placeholder="Min"
              />
              <input
                type="number"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter((prev) => ({ ...prev, max: Number(e.target.value) }))}
                className="border p-2 w-20 rounded"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Service Display */}
        {Object.entries(groupedServices).map(([category, services]) => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-300">
              {category}
            </h2>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {services.map((service) => (
                  <CarouselItem
                    key={service._id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Card className="h-[400px] bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 relative group">
                      <CardHeader className="p-0">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col h-[calc(100%-192px)]">
                        <CardTitle className="text-lg font-semibold mb-1 h-12 overflow-hidden">
                          {service.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-2 h-12 overflow-hidden">{service.description}</p>
                        <p className="text-lg font-bold text-gray-800 -my-2">₹{service.price}</p>
                        <div className="absolute bottom-4 left-4 right-4">
                          <Button
                            variant="outline"
                            onClick={() => handleServiceClick(service._id)}
                            className="w-full bg-black text-white border-gray-300 hover:bg-gray-200 hover:text-black transition-all duration-300 transform group-hover:scale-105"
                          >
                            More Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-lg shadow-md" />
              <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-lg shadow-md" />
            </Carousel>
          </section>
        ))}
      </main>

      {selectedServiceId && <ServiceDetailsContent slug={selectedServiceId} onClose={handleCloseDetails} />}
    </div>
  )
}
