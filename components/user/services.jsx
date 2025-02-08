"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const services = [
  { id: 1, category: "AC Services", name: "AC Installation", description: "Expert AC installation at your convenience.", image: null, price: 1200 },
  { id: 2, category: "AC Services", name: "AC Cleaning", description: "Thorough AC cleaning services for better efficiency.", image: null, price: 800 },
  { id: 3, category: "AC Services", name: "AC Repair", description: "Reliable AC repair services at your doorstep.", image: null, price: 1500 },
  { id: 4, category: "AC Services", name: "AC Gas Refill", description: "Affordable AC gas refilling services.", image: null, price: 1000 },
  { id: 5, category: "AC Services", name: "AC Maintenance", description: "Periodic maintenance for better performance.", image: null, price: 1300 },

  { id: 6, category: "Fan Services", name: "Fan Installation", description: "Quick and reliable fan installation services.", image: null, price: 500 },
  { id: 7, category: "Fan Services", name: "Fan Repair", description: "Professional fan repair services for all types.", image: null, price: 700 },
  { id: 8, category: "Fan Services", name: "Fan Cleaning", description: "Deep cleaning service for better performance.", image: null, price: 600 },
  { id: 9, category: "Fan Services", name: "Fan Motor Replacement", description: "Efficient fan motor replacement.", image: null, price: 900 },
  { id: 10, category: "Fan Services", name: "Fan Speed Fixing", description: "Fix speed issues in your fan.", image: null, price: 650 },

  { id: 11, category: "Refrigerator Services", name: "Fridge Installation", description: "Expert fridge installation at your convenience.", image: null, price: 1800 },
  { id: 12, category: "Refrigerator Services", name: "Fridge Repair", description: "Reliable fridge repair services.", image: null, price: 2000 },
  { id: 13, category: "Refrigerator Services", name: "Fridge Gas Refill", description: "Safe and efficient gas refilling service.", image: null, price: 1400 },
  { id: 14, category: "Refrigerator Services", name: "Fridge Deep Cleaning", description: "Thorough fridge cleaning service.", image: null, price: 900 },
  { id: 15, category: "Refrigerator Services", name: "Fridge Maintenance", description: "Periodic fridge maintenance services.", image: null, price: 1600 },

  { id: 16, category: "Washing Machine Services", name: "Washing Machine Installation", description: "Hassle-free washing machine installation.", image: null, price: 1700 },
  { id: 17, category: "Washing Machine Services", name: "Washing Machine Repair", description: "Expert repair services for washing machines.", image: null, price: 2200 },
  { id: 18, category: "Washing Machine Services", name: "Washing Machine Drum Cleaning", description: "Professional drum cleaning service.", image: null, price: 1100 },
  { id: 19, category: "Washing Machine Services", name: "Washing Machine Motor Fix", description: "Efficient motor replacement services.", image: null, price: 2100 },
  { id: 20, category: "Washing Machine Services", name: "Washing Machine Maintenance", description: "Regular maintenance for longevity.", image: null, price: 1300 },
];

const groupedServices = services.reduce((acc, service) => {
  if (!acc[service.category]) {
    acc[service.category] = [];
  }
  acc[service.category].push(service);
  return acc;
}, {});

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold text-center mb-6 animate-fadeIn">My Services</h1>
      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category} className="mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-md shadow-md inline-block tracking-wide uppercase border-b-4 border-gray-600">{category}</h2>
          <div className="relative max-w-full px-2 mx-auto overflow-hidden py-6 ">
          <div className="bg-gray-100 py-8 rounded-xl shadow-lg border border-gray-300">
          <Carousel className="flex gap-2 h-full items-center justify-center">
              <CarouselContent className="flex gap-2 px-2 py-4">
                {services.map((service) => (
                  <CarouselItem key={service.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center">
                    <Card className="bg-gray-900 text-white border border-gray-700 hover:shadow-xl transition-transform transform 
    hover:scale-105 w-72 shadow-lg">
                      <CardHeader>
                        <img src={service.image} alt={service.name} className="w-full h-40 object-cover rounded-t-lg" />
                        <CardTitle className="mt-2 h-8">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 h-12">{service.description}</p>
                        <p className="text-lg font-semibold mt-2 h-5">₹{service.price}</p>
                        <Button
                          variant="outline"
                          className="mt-4 w-full border-white text-black hover:bg-black hover:text-white transition-all duration-300"
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 sm:p-3 rounded-lg shadow-md" />
              <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-lg shadow-md" />
            </Carousel>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
}
