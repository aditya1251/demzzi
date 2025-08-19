"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
} from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features?: string[];
  price: number;
  timeline?: string;
  imageUrl?: string;
  isActive?: boolean;
  isPopular?: boolean; // highlight best sellers
};

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  services: Service[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const currencyINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function ServiceCard({
  service,
  onNavigate,
  categorySlug,
}: {
  service: Service;
  onNavigate: (slug: string, category: string) => void;
  categorySlug: string;
}) {
  const comingSoon = !service.isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        key={service.id}
        className="group hover:shadow-lg transition-all duration-300 relative cursor-pointer"
        onClick={() => !comingSoon && onNavigate(service.slug, categorySlug)}
      >
        {/* Best Seller Badge */}
        {service.isPopular && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Best Seller
          </span>
        )}

        <CardContent className="p-6">
          <div className="flex space-x-4 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
              {service.imageUrl ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-800">
                {service.title}
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                {service.description}
              </CardDescription>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {(service.features ?? []).slice(0, 3).map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <CheckSquare className="w-4 h-4 text-green-500 mr-2" /> {f}
                  </li>
                ))}
              </ul>

              {/* Price & CTA */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-green-800">
                  {currencyINR(service.price ?? 0)}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.timeline ?? "Varies"}
                </div>
              </div>

              <Button
                disabled={comingSoon}
                aria-disabled={comingSoon}
                className={`w-full ${
                  comingSoon
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {comingSoon ? "Coming Soon" : "Get Started"}
                {!comingSoon && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ServicesPage() {
  const router = useRouter();
  const { data: categories, error, mutate } = useSWR<Category[]>(
    "/api/categories",
    fetcher
  );

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const goBack = useCallback(() => router.back(), [router]);
  const navigateTo = useCallback(
    (serviceSlug: string, categorySlug: string) => {
      router.push(`/services/${serviceSlug}`);
    },
    [router]
  );

  useEffect(() => {
    if (categories && categories.length > 0 && !openCategory) {
      setOpenCategory(categories[0].id);
    }
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="p-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-green-800">Our Services</h1>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        className="px-6 py-10 bg-gradient-to-r from-green-600 to-green-700 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-3">
            Grow Your Business With Ease 🚀
          </h2>
          <p className="text-lg text-green-100">
            Simplify compliance, save time, and focus on scaling your business.
          </p>
        </div>
      </motion.section>

      {/* Categories Accordion */}
      <section className="px-6 py-12 max-w-6xl mx-auto space-y-6">
        {error && (
          <div className="text-center mb-6">
            <div className="text-red-600 mb-2">Failed to load categories.</div>
            <Button onClick={() => mutate()}>Retry</Button>
          </div>
        )}

        {!categories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-40 bg-gray-100" />
            ))}
          </div>
        ) : (
          categories.map((cat) => {
            const isOpen = openCategory === cat.id;

            return (
              <div
                key={cat.id}
                className="border rounded-xl bg-white shadow-sm overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-bold text-green-800 hover:bg-green-50"
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                >
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

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cat.services.map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            onNavigate={navigateTo}
                            categorySlug={cat.slug}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </section>

      {/* Trust Section */}
      <motion.section
        className="px-6 py-16 bg-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-green-800">
            Why Businesses Trust Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Secure & Reliable",
                icon: Shield,
                desc: "Bank-level security protects your data.",
              },
              {
                title: "Expert Guidance",
                icon: Users,
                desc: "Certified professionals available anytime.",
              },
              {
                title: "Fast Processing",
                icon: Clock,
                desc: "Get compliance done in record time.",
              },
            ].map(({ title, icon: Icon, desc }) => (
              <motion.div
                key={title}
                className="p-6 text-center border rounded-lg hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <MobileNav />
    </div>
  );
}
