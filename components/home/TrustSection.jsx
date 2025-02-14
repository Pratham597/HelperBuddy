"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import AnimatedCounter from "./AnimatedCounter";
import { Users, Building, ShoppingBag, Package } from "lucide-react";

const trustData = [
  { 
    title: "Trusted Partners", 
    value: 150, 
    Icon: Building,
    description: "Global Partnerships"
  },
  { 
    title: "Happy Customers", 
    value: 1000, 
    Icon: Users,
    description: "Satisfied Clients"
  },
  { 
    title: "Service Categories", 
    value: 100, 
    Icon: ShoppingBag,
    description: "Unique Products"
  },
  { 
    title: "Service Delivered", 
    value: 5000, 
    Icon: Package,
    description: "Successful Deliveries"
  },
];

export default function TrustSection() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="py-12 md:py-20 px-4 bg-gradient-to-b from-white via-slate-50 to-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trust in Numbers
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers who have made us their preferred choice
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2 md:px-4">
          {trustData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="mb-6 bg-slate-50 p-4 rounded-full">
                  <item.Icon 
                    size={28}
                    className="text-blue-600" 
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 text-center">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  {item.description}
                </p>
                <div className="relative">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600">
                    {isInView ? (
                      <AnimatedCounter from={0} to={item.value} />
                    ) : (
                      0
                    )}
                    {item.title === "Happy Customers" ||
                    item.title === "Service Delivered"
                      ? "+"
                      : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}