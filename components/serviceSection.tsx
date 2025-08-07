"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx"; // Make sure to install this via `npm i clsx` or use string template

interface Service {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="px-4 lg:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-12 text-center lg:text-left">
          Our Services
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="animate-pulse bg-gray-100 h-48 rounded-xl"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-2xl" />
                    <div className="w-3/4 h-4 bg-gray-300 rounded" />
                    <div className="w-1/2 h-4 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))
            : services.map((service) => {
                const isInactive = !service.isActive;

                return (
                  <Card
                    key={service.id}
                    className={clsx(
                      "text-center transition-all duration-300 rounded-xl",
                      "hover:shadow-lg hover:scale-105",
                      "cursor-pointer bg-[#f6fbf4]",
                      isInactive && "opacity-50 grayscale cursor-not-allowed"
                    )}
                    onClick={() =>
                      !isInactive && router.push(`/${service.id}`)
                    }
                    title={
                      isInactive ? "This service is currently unavailable" : ""
                    }
                  >
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-[#eaf6ed] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          width={48}
                          height={48}
                          className="object-contain max-h-12"
                        />
                      </div>
                      <h3 className="font-semibold text-green-800 text-xl mb-2">
                        {service.title}
                      </h3>
                      <h4 className="font-semibold text-green-800">
                        ₹ {service.price}-
                      </h4>
                      {isInactive && (
                        <p className="text-xs text-red-500 mt-2">
                          Currently unavailable
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>
    </section>
  );
}
