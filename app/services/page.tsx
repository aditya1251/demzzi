// app/services/page.tsx
"use client";

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
  Building,
  FileText,
  Users,
  Shield,
} from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

type Service = {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: number;
  timeline: string;
  imageUrl?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServicesPage() {
  const router = useRouter();
  const { data: services, error } = useSWR<Service[]>("/api/services", fetcher);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-green-800">Our Services</h1>
        </div>
      </header>

      <section className="px-6 py-10 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-3">
            Professional Compliance Services
          </h2>
          <p className="text-lg text-green-100">
            Business compliance made simple. Explore our range of expert
            services tailored for your growth.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        {error && <div className="text-red-600">Failed to load services</div>}
        {!services ? (
          <div className="text-center py-20 text-gray-500">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon =
                service.id === "gst"
                  ? CheckSquare
                  : service.id === "itr"
                  ? FileText
                  : Building;
              const comingSoon = !["gst", "itr"].includes(
                service.title.toLowerCase()
              );

              return (
                <Card
                  key={service.id}
                  className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex space-x-4 items-start">
                      <div className="flex-shrink-0 w-16 p-2 h-16 rounded-2xl overflow-hidden  flex items-center justify-center">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="w-8 h-8 text-white bg-green-500 rounded-xl p-2" />
                        )}
                      </div>

                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-800">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mb-4">
                          {service.description}
                        </CardDescription>

                        <ul className="space-y-2 mb-4">
                          {service.features.map((f, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-gray-600">
                              <CheckSquare className="w-4 h-4 text-green-500 mr-2" />{" "}
                              {f}
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">{service.timeline}</span>
                          </div>
                          <div className="text-2xl font-bold text-green-800">
                            ₹{service.price.toLocaleString()}
                          </div>
                        </div>

                        <Button
                          onClick={() =>
                            comingSoon
                              ? undefined
                              : router.push(`/${service.id}`)
                          }
                          disabled={comingSoon}
                          className={`w-full ${
                            comingSoon
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-green-500 hover:opacity-90"
                          } text-white`}>
                          {comingSoon ? "Coming Soon" : "Get Started"}
                          {!comingSoon && (
                            <ArrowRight className="ml-2 w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-green-800">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Secure & Reliable",
                icon: Shield,
                desc: "Bank‑level security protects your data.",
              },
              {
                title: "Expert Support",
                icon: Users,
                desc: "24/7 support from certified professionals.",
              },
              {
                title: "Fast Processing",
                icon: Clock,
                desc: "Quick turnaround on all services.",
              },
            ].map(({ title, icon: Icon, desc }) => (
              <div
                key={title}
                className="p-6 text-center border rounded-lg hover:shadow-lg transition">
                <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  );
}
