"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ServiceDetails from "./service-details";
import { poppins } from "../fonts/font";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServiceDetailsContent({ slug }) {
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const fetchService = async () => {
      try {
        setError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/service/${slug}`,
          { signal: controller.signal }
        );
        if (res.data) {
          setService(res.data);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Failed to fetch service details.");
          console.error("Error fetching service:", error);
        }
      }
    };

    fetchService();
    return () => controller.abort();
  }, [slug]);

  const handleClose = () => {
    setIsOpen(false);
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${poppins.variable} font-sans`}>
      <main className="container mx-auto px-4 py-8">
        {!service ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : isOpen ? (
          <ServiceDetails service={service} onClose={handleClose} />
        ) : (
          <p className="text-center">Continue shopping for services.</p>
        )}
      </main>
    </div>
  );
}
