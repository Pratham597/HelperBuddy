"use client";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Illustration from "@/app/assets/indian-cities.png"
const CitiesWeServe = () => {
  const cities = [
    "Mumbai", 
    "Surat",
    "Indore",
    "Hyderabad"
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          {/* Left side - Title and City Buttons */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Cities We Serve</h2>
            
            <div className="flex flex-wrap gap-3">
              {cities.map((city, index) => (
                <button
                  key={index}
                  className="flex items-center px-5 py-3 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MapPin size={20} className="mr-2" />
                  <span className="text-base font-medium">{city}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right side - Illustration */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-74 md:h-100">
              <Image 
                src={Illustration} 
                alt="India cities illustration"
                className="w-full h-full object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitiesWeServe;