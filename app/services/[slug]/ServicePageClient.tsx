// app/services/[slug]/ServicePageClient.tsx
"use client";

import React, { useRef, useState } from "react";
import EditorReadOnly from "@/components/EditorReadOnly"
import { Button } from "@/components/ui/button";
import { ArrowDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import FormInline from "@/components/ServiceFormInline"; // we'll include this too (or inline)

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

export default function ServicePageClient({
  service,
  sections,
  formFields,
}: {
  service: Service;
  sections: Section[];
  formFields: any[]; // ServiceFormField[]
}) {
  const router = useRouter();
  const formRef = useRef<HTMLElement | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-green-800 leading-tight">
              {service.title}
            </h1>
            <p className="mt-4 text-lg text-gray-700">{service.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <Button
                className="bg-green-800 hover:bg-green-900 text-white rounded-xl"
                onClick={() => {
                  // scroll to form
                  const el = document.getElementById("service-form");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                Get Started
              </Button>

              <Button variant="outline" onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}>
                <ArrowDown className="w-4 h-4 mr-2" /> Learn More
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <strong>Price:</strong> {service.price ? `₹${service.price}` : "Call for price"} •{" "}
              <strong>Timeline:</strong> {service.timeline || "Varies"}
            </div>
          </div>

          {service.imageUrl && (
            <div className="flex items-center justify-center">
              <img src={service.imageUrl} alt={service.title} className="rounded-2xl shadow-lg w-full max-w-sm object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section id="service-form" className="py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-green-800">Quick Enquiry</h3>
            <p className="text-sm text-gray-600 mt-1">Fill this form and our team will reach out.</p>
            <div className="mt-4">
              {/* Use the inline form component (it uses same validation + submission API you had) */}
              <FormInline serviceId={service.id} formFields={formFields} />
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-800">Why choose {service.title}?</h4>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(service.features || []).map((f, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-green-50/30">
                    <div className="font-medium text-green-800">{f}</div>
                  </div>
                ))}

                {(!service.features || service.features.length === 0) && (
                  <div className="text-sm text-gray-500">No features configured yet.</div>
                )}
              </div>
            </div>

            {/* Content sections rendered from TipTap JSON */}
            <div className="space-y-6">
              {sections.map((sec) => (
                <article key={sec.id} className="bg-white border rounded-2xl p-6">
                  <div className="flex gap-6">
                    {sec.image && (
                      <img src={sec.image} alt={sec.title} className="w-32 h-24 object-cover rounded-md" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-green-800">{sec.title}</h3>
                      <div className="mt-3 prose max-w-none text-gray-700">
                        {sec.content ? <EditorReadOnly content={sec.content} /> : <p className="text-sm text-gray-500">No content.</p>}
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
