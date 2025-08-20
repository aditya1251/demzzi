"use client";

import React, { useCallback, useEffect, useState } from "react";
import EditorReadOnly from "@/components/EditorReadOnly";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FormInline from "@/components/ServiceFormInline";

type Service = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  timeline?: string;
  features?: string[];
};
type Section = {
  id: string;
  title: string;
  image?: string | null;
  content?: any;
  order?: number;
};

export default function ServicePageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data.service);
        setSections(data.sections);
        setFormFields(data.formFields);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !service) {
    return (
      <main className="min-h-screen bg-gray-50 animate-pulse">
        {/* HEADER skeleton */}
        <div className="h-16 bg-white shadow-sm flex items-center px-6">
          <div className="w-8 h-8 bg-gray-200 rounded mr-4" />
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>

        {/* HERO skeleton */}
        <section className="max-w-6xl mx-auto h-[80vh] py-28 px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 w-3/4 rounded" />
            <div className="h-4 bg-gray-200 w-full rounded" />
            <div className="h-4 bg-gray-200 w-5/6 rounded" />
            <div className="flex gap-4 mt-6">
              <div className="h-10 w-32 bg-gray-200 rounded-lg" />
              <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-4 w-48 bg-gray-200 rounded mt-4" />
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </section>

        {/* FORM + FEATURES skeleton */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-6 space-y-3">
                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white fixed z-50 w-full shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
            aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-green-800">{service.title}</h1>
        </div>
      </header>
      {/* HERO */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className=" translate-y-8 lg:-translate-y-1/3">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-green-800 leading-tight">
              {service.title}
            </h1>
            <p className="mt-4  lg:text-lg text-gray-700">
              {service.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Button
                className="bg-green-800 hover:bg-green-900 text-white rounded-xl"
                onClick={() => {
                  // scroll to form
                  const el = document.getElementById("service-form");
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}>
                Get Started
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  window.scrollTo({ top: 700, behavior: "smooth" })
                }>
                <ArrowDown className="w-4 h-4 mr-2" /> Learn More
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <strong>Price:</strong>{" "}
              {service.price ? `₹${service.price}` : "Call for price"} •{" "}
              <strong>Timeline:</strong> {service.timeline || "Varies"}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/women.png"
              alt={service.title}
              className="rounded-2xl w-4/5 lg:w-full max-w-sm object-cover"
            />
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="service-form" className="py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className=" -translate-y-28 lg:-translate-y-1/3 lg:col-span-1 bg-white border p-6 rounded-2xl shadow-sm">
            <div className="mt-4">
              {/* Use the inline form component (it uses same validation + submission API you had) */}
              <FormInline serviceId={service.id} formFields={formFields} />
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-2 space-y-6 -translate-y-28 lg:translate-y-0">
            <div className="bg-white border rounded-2xl p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                Why choose {service.title}?
              </h4>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(service.features || []).map((f, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-green-50/30">
                    <div className="font-medium text-green-800 text-sm sm:text-base">
                      {f}
                    </div>
                  </div>
                ))}

                {(!service.features || service.features.length === 0) && (
                  <div className="text-xs sm:text-sm text-gray-500">
                    No features configured yet.
                  </div>
                )}
              </div>
            </div>

            {/* Content sections rendered from TipTap JSON */}
            <div className="space-y-6">
              {sections.map((sec) => (
                <article
                  key={sec.id}
                  className="bg-white border rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {sec.image && (
                      <img
                        src={sec.image}
                        alt={sec.title}
                        className="w-full sm:w-32 h-40 sm:h-24 object-contain rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-green-800">
                        {sec.title}
                      </h3>
                      <div className="mt-3 prose max-w-none text-gray-700 text-sm sm:text-base">
                        {sec.content ? (
                          <EditorReadOnly content={sec.content} />
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-500">
                            No content.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
