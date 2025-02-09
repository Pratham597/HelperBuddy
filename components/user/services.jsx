"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/service-card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import UserNavbar from "../UserNavbar"
import { poppins } from "../fonts/font"

const services = [
  {
    id: 1,
    category: "AC Services",
    name: "AC Installation",
    description: "Expert AC installation at your convenience.",
    image:
      "https://media.istockphoto.com/id/1208084866/photo/repairer-repairing-air-conditioner.webp?a=1&b=1&s=612x612&w=0&k=20&c=wfHliIRaBsiqWqmr1gHWFtESrdqwJ7Azf1KBlEh-cSw=",
    price: 1200,
  },
  {
    id: 2,
    category: "AC Services",
    name: "AC Cleaning",
    description: "Thorough AC cleaning services for better efficiency.",
    image:
      "https://media.istockphoto.com/id/1284843352/photo/the-technicians-are-cleaning-the-air-conditioner-by-spraying-water-hand-and-water-spray-are.webp?a=1&b=1&s=612x612&w=0&k=20&c=sJyiPhLk0LJdpvJAsswYqeOSwZWypX2qztfCc-XvREk=",
    price: 800,
  },
  {
    id: 3,
    category: "AC Services",
    name: "AC Repair",
    description: "Reliable AC repair services at your doorstep.",
    image: "https://media.istockphoto.com/id/492892828/photo/air-conditioning-engineer.webp?a=1&b=1&s=612x612&w=0&k=20&c=GgvNuEV3Pue8ioVhMOWwJDaJWSmQHJk9Ufd3H7s3otA=",
    price: 1500,
  },
  {
    id: 4,
    category: "AC Services",
    name: "AC Gas Refill",
    description: "Affordable AC gas refilling services.",
    image: "https://media.istockphoto.com/id/530806724/photo/freon-air-conditioner-refill.webp?a=1&b=1&s=612x612&w=0&k=20&c=VrK9OjrU4Q_ZjsUPe1DoUXjrGjU2RerbumTOOuAuLqM=",
    price: 1000,
  },
  {
    id: 5,
    category: "AC Services",
    name: "AC Maintenance",
    description: "Periodic maintenance for better performance.",
    image: "https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWMlMjBtYWludGVuYW5jZXxlbnwwfHwwfHx8MA%3D%3D",
    price: 1300,
  },

  {
    id: 6,
    category: "Fan Services",
    name: "Fan Installation",
    description: "Quick and reliable fan installation services.",
    image: "https://media.istockphoto.com/id/187062338/photo/real-electrician-hanging-a-ceiling-fan-rr.webp?a=1&b=1&s=612x612&w=0&k=20&c=PBawCM2k-F4tLkGeyfBuuMTPPH9sE6sDqO8NLWR0y_A=",
    price: 500,
  },
  {
    id: 7,
    category: "Fan Services",
    name: "Fan Repair",
    description: "Professional fan repair services for all types.",
    image: "https://media.istockphoto.com/id/865382430/photo/handyman-installing-a-ceiling-fan.webp?a=1&b=1&s=612x612&w=0&k=20&c=rjgHOSHGNqqChLV5DhIn2h49w7UZ7wO87QgnAxTn-Ug=",
    price: 700,
  },
  {
    id: 8,
    category: "Fan Services",
    name: "Fan Cleaning",
    description: "Deep cleaning service for better performance.",
    image: "https://media.istockphoto.com/id/1302714315/photo/woman-cleaning-ceiling-fan-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=D_ogbkF-ECBalmSz9UdrtTk6y3Gcq5UMIAsdXerM_6I=",
    price: 600,
  },
  {
    id: 9,
    category: "Fan Services",
    name: "Fan Motor Replacement",
    description: "Efficient fan motor replacement.",
    image: null,
    price: 900,
  },
  {
    id: 10,
    category: "Fan Services",
    name: "Fan Speed Fixing",
    description: "Fix speed issues in your fan.",
    image: null,
    price: 650,
  },

  {
    id: 11,
    category: "Refrigerator Services",
    name: "Fridge Installation",
    description: "Expert fridge installation at your convenience.",
    image: "https://media.istockphoto.com/id/1180607321/photo/two-young-male-movers-placing-steel-refrigerator-in-kitchen.webp?a=1&b=1&s=612x612&w=0&k=20&c=RFgizG-npxoVj17exb331a2VR79iCCGuzrAh8ztnLXw=",
    price: 1800,
  },
  {
    id: 12,
    category: "Refrigerator Services",
    name: "Fridge Repair",
    description: "Reliable fridge repair services.",
    image: "",
    price: 2000,
  },
  {
    id: 13,
    category: "Refrigerator Services",
    name: "Fridge Gas Refill",
    description: "Safe and efficient gas refilling service.",
    image: null,
    price: 1400,
  },
  {
    id: 14,
    category: "Refrigerator Services",
    name: "Fridge Deep Cleaning",
    description: "Thorough fridge cleaning service.",
    image: null,
    price: 900,
  },
  {
    id: 15,
    category: "Refrigerator Services",
    name: "Fridge Maintenance",
    description: "Periodic fridge maintenance services.",
    image: null,
    price: 1600,
  },

  {
    id: 16,
    category: "Washing Machine Services",
    name: "Washing Machine Installation",
    description: "Hassle-free washing machine installation.",
    image: null,
    price: 1700,
  },
  {
    id: 17,
    category: "Washing Machine Services",
    name: "Washing Machine Repair",
    description: "Expert repair services for washing machines.",
    image: null,
    price: 2200,
  },
  {
    id: 18,
    category: "Washing Machine Services",
    name: "Washing Machine Drum Cleaning",
    description: "Professional drum cleaning service.",
    image: null,
    price: 1100,
  },
  {
    id: 19,
    category: "Washing Machine Services",
    name: "Washing Machine Motor Fix",
    description: "Efficient motor replacement services.",
    image: null,
    price: 2100,
  },
  {
    id: 20,
    category: "Washing Machine Services",
    name: "Washing Machine Maintenance",
    description: "Regular maintenance for longevity.",
    image: null,
    price: 1300,
  },
]

const groupedServices = services.reduce((acc, service) => {
  if (!acc[service.category]) {
    acc[service.category] = []
  }
  acc[service.category].push(service)
  return acc
}, {})

export default function ServicesPage() {
  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${poppins.variable} font-sans`}>
      <UserNavbar />
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
                    key={service.id}
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
                        <p className="text-lg font-bold text-gray-800 mt-auto mb-2">₹{service.price}</p>
                        <div className="absolute bottom-4 left-4 right-4">
                          <Button
                            variant="outline"
                            className="w-full bg-white text-gray-800 border-gray-300 hover:bg-black hover:text-white transition-all duration-300 transform group-hover:scale-105"
                          >
                            Book Now
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

