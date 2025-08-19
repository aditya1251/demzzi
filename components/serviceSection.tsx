"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Service {
  id: number;
  title: string;
  price: number;
  slug: string;
  imageUrl: string;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  services: Service[];
}

export default function ServicesShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);

        if (data.length > 0) {
          setOpenCategory(data[0].id); // open first category by default
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="px-4 lg:px-6 py-16 bg-[#f6fbf4]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-12 text-center">
          Our Services
        </h2>

        {loading ? (
          <div className="space-y-6">
            {/* Skeleton for 3 categories */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="border rounded-xl bg-white shadow-sm overflow-hidden">
                {/* Category Header Skeleton */}
                <div className="flex justify-between items-center px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
                    <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Services Grid Skeleton */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, sidx) => (
                    <Card
                      key={sidx}
                      className="animate-pulse bg-gray-100 h-44 rounded-xl">
                      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-2xl" />
                        <div className="w-3/4 h-4 bg-gray-300 rounded" />
                        <div className="w-1/2 h-4 bg-gray-200 rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((cat) => {
              const isOpen = openCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className="border rounded-xl bg-white shadow-sm overflow-hidden">
                  {/* Category Header */}
                  <button
                    className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-bold text-green-800 hover:bg-green-50 transition"
                    onClick={() => setOpenCategory(isOpen ? null : cat.id)}>
                    <div className="flex items-center gap-3">
                      {cat.imageUrl && (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      )}
                      {cat.name}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  {/* Animated Services */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="p-6">
                          <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            autoplay={{
                              delay: 3500,
                              disableOnInteraction: false,
                            }}
                            loop={true}
                            pagination={{ clickable: true }}
                            breakpoints={{
                              640: { slidesPerView: 1 },
                              768: { slidesPerView: 2 },
                              1024: { slidesPerView: 3 },
                            }}
                            className="pb-12" // extra padding for bullets
                          >
                            {cat.services.map((service, idx) => {
                              const isInactive = !service.isActive;
                              return (
                                <SwiperSlide key={service.id}>
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="h-full">
                                    <Card
                                      className={clsx(
                                        "text-center  transition-all duration-300 rounded-xl h-full flex flex-col",
                                        isInactive
                                          ? "opacity-50 grayscale cursor-not-allowed"
                                          : "hover:shadow-lg hover:scale-105 cursor-pointer"
                                      )}
                                      onClick={() =>
                                        !isInactive &&
                                        router.push(
                                          `/services/${service.slug}`
                                        )
                                      }
                                      title={
                                        isInactive
                                          ? "This service is currently unavailable"
                                          : ""
                                      }>
                                      <CardContent className="p-6 flex-1 flex flex-col items-center justify-between">
                                        {/* Icon/Image */}
                                        <div className="w-16 h-16 bg-[#eaf6ed] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                          <Image
                                            src={service.imageUrl}
                                            alt={service.title}
                                            width={48}
                                            height={48}
                                            className="object-contain max-h-12"
                                          />
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-semibold text-green-800 text-lg mb-1">
                                          {service.title}
                                        </h3>

                                        {/* Price */}
                                        <h4 className="font-semibold text-green-700 text-base">
                                          ₹ {service.price}
                                        </h4>

                                        {/* CTA / Status */}
                                        {!isInactive && (
                                          <p className="text-sm text-gray-500 mt-2">
                                            Click to learn more
                                          </p>
                                        )}
                                        {isInactive && (
                                          <p className="text-xs text-red-500 mt-2">
                                            Currently unavailable
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                          <div className="text-center mt-6">
                            <a
                              href={`/services`}
                              className="inline-block text-green-700 font-semibold hover:text-green-900 transition">
                              View All Services →
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
