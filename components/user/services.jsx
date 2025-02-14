"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/service-card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { poppins } from "../fonts/font"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const router = useRouter();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/service`)
        const data = res.data
        setServices(data)
      } catch (error) {
        console.error("Failed to fetch services", error)
      }
    }

    fetchServices()
  }, [])

  const groupedServices = services?.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {})

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${poppins.variable} font-sans`}>
      <main className="container mx-auto px-4 py-8">
        {Object.entries(groupedServices).map(([category, services]) => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-300">
              {category}
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
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
                              onClick={() => router.push(`/services/${service._id}`)}
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
    </div>
  )
}

