"use client";

import { useState, useEffect } from "react";
import { Category, Service } from "@prisma/client";
import Image from "next/image";
import { ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryWithServices extends Category {
  services: Service[];
}

export default function ServicesSearchPage() {
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [search, setSearch] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const router = useRouter();
  // Fetch categories and services
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/categories");
      const data: CategoryWithServices[] = await res.json();
      setCategories(data);
    }
    fetchData();
  }, []);

  // Filter services based on search
  useEffect(() => {
    if (!search) {
      setFilteredServices([]);
      return;
    }
    const allServices = categories.flatMap((cat) => cat.services);
    const filtered = allServices.filter((service) =>
      service.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [search, categories]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">
        Search Services
      </h1>

      {/* Search Input with Icon */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 text-gray-700"
        />
      </div>

      <div className="flex flex-col gap-4">
        {search && filteredServices.length === 0 && (
          <p className="text-gray-500 text-center">No services found.</p>
        )}

        {filteredServices.map((service) => {
          const category = categories.find((c) => c.id === service.categoryId);
          if (!category) return null;

          const serviceUrl = `/services/${service.slug}`;

          return (
            <div
              key={service.id}
              onClick={() => router.push(serviceUrl)}
              className="flex items-center justify-between p-4 border rounded-xl hover:shadow-lg transition-all bg-white cursor-pointer">
              <div className="flex items-center gap-4">
                {service.imageUrl && (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-green-800 line-clamp-1">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {service.description}
                  </p>
                </div>
              </div>
              <button className="ml-4 flex items-center justify-center text-green-600 font-bold text-lg hover:text-green-700">
                <ChevronRight />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
