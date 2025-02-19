"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter, useParams } from "next/navigation"
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/service-card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import ServiceDetailsContent from "@/components/user/serviceDetailsContent"
import { motion, AnimatePresence } from "framer-motion"
import { poppins } from "../fonts/font"
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import useServiceStore from "@/Store/useServiceStore"
import { ScrollArea } from '@/components/ui/scroll-area';

const ServiceCardSkeleton = () => (
  <Card className="w-full h-[440px] bg-white rounded-2xl overflow-hidden shadow-sm">
    <div className="w-full h-[60%] relative">
      <Skeleton className="w-full h-full" />
      <Skeleton className="absolute top-4 right-4 h-8 w-24 rounded-full" />
    </div>
    <div className="p-4 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  </Card>
);

const ServiceSkeletonSection = () => (
  <div className="mb-12">
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  </div>
);


const FilterPanel = ({
  allCategories,
  selectedCategories,
  toggleCategory,
  priceFilter,
  setPriceFilter,
  onApplyFilters,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="p-4 w-[300px] bg-white rounded-lg shadow-lg flex flex-col h-[calc(80vh-80px)]"
  >
    <ScrollArea className="flex-grow pr-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                onClick={() => toggleCategory(category)}
                className="text-sm justify-start h-8 whitespace-nowrap transition-all duration-300 hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="space-y-4">
            <Slider
              defaultValue={[priceFilter.min, priceFilter.max]}
              max={10000}
              step={100}
              onValueChange={(value) => setPriceFilter((prev) => ({ ...prev, min: value[0], max: value[1] }))}
              className="mt-2"
            />
            <div className="flex justify-between text-sm">
              <span>₹{priceFilter.min.toLocaleString()}</span>
              <span>₹{priceFilter.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Sort By</h3>
          <div className="flex flex-col gap-2">
            <Button
              variant={priceFilter.type === "asc" ? "default" : "outline"}
              onClick={() => setPriceFilter((prev) => ({ ...prev, type: "asc" }))}
              className="justify-start transition-all duration-300 hover:scale-105"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Price: Low to High
            </Button>
            <Button
              variant={priceFilter.type === "desc" ? "default" : "outline"}
              onClick={() => setPriceFilter((prev) => ({ ...prev, type: "desc" }))}
              className="justify-start transition-all duration-300 hover:scale-105"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Price: High to Low
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>

    <div className="pt-4 mt-4 border-t">
      <Button
        onClick={onApplyFilters}
        className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-300"
      >
        Apply Filters
      </Button>
    </div>
  </motion.div>
);

const ServiceCard = ({ service, onServiceClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="h-[440px]"
  >
    <Card className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[60%]">
        <motion.img
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center bg-white shadow-md rounded-lg px-2 py-1 text-xs font-semibold">
          <span className="text-gray-800">{service.rating}</span>
          <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {service.description}
          </p>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">₹{service.price.toLocaleString()}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">

                </div>
                <span className="text-xs font-medium">{service.total_bookings}+ Bookings</span>
              </div>
            </div>
            <Button
              onClick={() => onServiceClick(service._id)}
              variant="default"
              className="w-full bg-black text-white hover:bg-gray-800 h-10"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);



export default function ServicesPage({ }) {
  const [services, setServices] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceFilter, setPriceFilter] = useState({ type: "none", min: 0, max: 10000 })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { selectedServiceId, clearSelectedService, setSelectedServiceId } = useServiceStore();
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sortType: "none",
  })
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/service`)
        setServices(res.data)
      } catch (error) {
        console.error("Failed to fetch services", error)
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices()
  }, []);
  
  useEffect(() => {
    if (params.id) {
      setSelectedServiceId(params.id)
    }
  }, [params.id])

  const allCategories = [...new Set(services.map((service) => service.category))]

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const applyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      priceRange: { min: priceFilter.min, max: priceFilter.max },
      sortType: priceFilter.type,
    })
    setIsFilterOpen(false)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceFilter({ type: "none", min: 0, max: 10000 })
    setAppliedFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      sortType: "none",
    })
  }

  const removeCategory = (category) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category))
    setAppliedFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }))
  }

  const filteredServices = services.filter((service) => {
    const categoryMatch = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(service.category)

    const priceMatch = service.price >= appliedFilters.priceRange.min && service.price <= appliedFilters.priceRange.max

    return categoryMatch && priceMatch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (appliedFilters.sortType === "asc") return a.price - b.price
    if (appliedFilters.sortType === "desc") return b.price - a.price
    return 0
  })

  const groupedServices = sortedServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push(service)
    return acc
  }, {})

  const handleServiceClick = (serviceId) => {
    setSelectedServiceId(serviceId)
    // router.push(`/services/${serviceId}`, undefined, { shallow: true })
  }

  const handleCloseDetails = () => {
    setSelectedServiceId(null)
    // router.push("/services", undefined, { shallow: true })
  }

  return (
    <div
      className={`min-h-screen mt-16 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 ${poppins.variable} font-sans`}
    >
      <main className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white hover:bg-gray-100 transition-colors duration-300">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <FilterPanel
                allCategories={allCategories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                onApplyFilters={applyFilters}
              />
            </PopoverContent>
          </Popover>

          {/* Active Filters Display */}
          <AnimatePresence>
            {(appliedFilters.categories.length > 0 ||
              appliedFilters.priceRange.min > 0 ||
              appliedFilters.priceRange.max < 10000 ||
              appliedFilters.sortType !== "none") && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  {appliedFilters.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="gap-1 bg-primary hover:text-black text-white px-2 py-1 rounded-full"
                    >
                      {category}
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1 hover:text-red-500 transition-colors duration-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {(appliedFilters.priceRange.min > 0 || appliedFilters.priceRange.max < 10000) && (
                    <Badge variant="secondary" className="bg-primary hover:text-black text-white px-2 py-1 rounded-full">
                      ₹{appliedFilters.priceRange.min} - ₹{appliedFilters.priceRange.max}
                    </Badge>
                  )}
                  {appliedFilters.sortType !== "none" && (
                    <Badge variant="secondary" className="bg-primary hover:text-black text-white px-2 py-1 rounded-full">
                      Price: {appliedFilters.sortType === "asc" ? "Low to High" : "High to Low"}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-200 transition-colors duration-300"
                  >
                    Clear All
                  </Button>
                </motion.div>
              )}
          </AnimatePresence>
        </motion.div>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <ServiceSkeletonSection />
            <ServiceSkeletonSection />
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-red-800 text-lg font-medium mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Services Display with Carousel */}
        <AnimatePresence>
          {Object.entries(groupedServices).map(([category, services]) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-300">{category}</h2>
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {services.map((service) => (
                    <CarouselItem
                      key={service._id}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <ServiceCard service={service} onServiceClick={handleServiceClick} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-lg shadow-md transition-all duration-300 hover:scale-110" />
                <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-lg shadow-md transition-all duration-300 hover:scale-110" />
              </Carousel>
            </motion.section>
          ))}
        </AnimatePresence>

        {!isLoading && !error && Object.keys(groupedServices).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-gray-800 text-xl font-medium mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-4">
                No services match your current filters.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-primary text-white hover:bg-primary/90 transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {selectedServiceId && <ServiceDetailsContent slug={selectedServiceId} onClose={handleCloseDetails} />}
    </div>
  )
}

