"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { useState } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Submission failed");

      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 98765 43210", "+91 87654 32109"],
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@demzzi.com", "info@demzzi.com"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Business District", "Mumbai, Maharashtra 400001"],
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfdfa] pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-green-800">Contact Us</h1>
          </div>
          <nav className="hidden lg:flex text-[#1c2d25] font-medium tracking-wider items-center space-x-8">
            <Button variant="link" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="link" onClick={() => router.push("/services")}>
              Services
            </Button>
            <Button variant="link" onClick={() => router.push("/pricing")}>
              Pricing
            </Button>
            <Button variant="link" onClick={() => router.push("/about")}>
              About Us
            </Button>
            <Button variant="link" onClick={() => router.push("/contact")}>
              Contact
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-green-100 text-lg mb-8">
            We're here to help you with all your compliance needs
          </p>
          <Button
            onClick={() => router.push("#contact-form")}
            className="bg-white text-green-800 hover:bg-green-100 group-hover:translate-x-2 px-8 py-4 text-lg rounded-full group">
            <span className="group-hover:translate-x-2">Send us a message</span>
            <ArrowRight
              size={20}
              className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform"
            />
          </Button>
        </div>
      </section>
      {/* Contact Form */}
      <section id="contact-form" className="px-4 py-16 bg-[#fbfdfa]">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-green-800">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your full name"
                      required
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-green-800">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Your phone number"
                      required
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-800">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Your email address"
                    required
                    className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-green-800">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="What can we help you with?"
                    required
                    className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-green-800">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more about your requirements..."
                    required
                    rows={5}
                    className="resize-none border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold rounded-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            Quick Answers
          </h2>

          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  How quickly can you process my application?
                </h3>
                <p className="text-gray-600">
                  GST registration takes 3-5 days, ITR filing takes 1-2 days.
                  We'll keep you updated throughout the process.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  Do you provide support after registration?
                </h3>
                <p className="text-gray-600">
                  Yes, we provide ongoing support and can help with compliance
                  requirements, renewals, and any questions you may have.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  What documents do I need to provide?
                </h3>
                <p className="text-gray-600">
                  The required documents vary by service. We'll provide you with
                  a complete checklist once you start your application.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  );
}
