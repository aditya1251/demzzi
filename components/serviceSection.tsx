"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
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
          {services.map((service) => (
            <Card
              key={service.id}
              className="text-center bg-[#f6fbf4] hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => router.push(`/${service.id}`)}
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#eaf6ed] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <img src={service.imageUrl} alt={service.title} className="max-h-12" />
                </div>
                <h3 className="font-semibold text-green-800 text-xl mb-2">
                  {service.title.split(" ").join(" ")} {/* line breaks can be custom handled */}
                </h3>
                <h4 className="font-semibold text-green-800">₹ {service.price}-</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
