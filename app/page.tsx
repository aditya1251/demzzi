"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckSquare,
  FileText,
  Building,
  Zap,
  Laptop,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "./providers";
import { MobileNav } from "@/components/mobile-nav";
import { signOut, useSession } from "next-auth/react";

// Splash Screen Component
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Mobile Status Bar */}
      <div className="absolute top-4 right-4 flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
        <div className="w-4 h-2 bg-green-600 rounded-sm"></div>
        <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
        <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
        <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-8 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-8 w-24 h-24 bg-green-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-12 w-16 h-16 bg-green-200 rounded-full opacity-25 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-sm mx-auto">
        {/* Get Started Title */}
        <h1 className="text-4xl font-bold text-green-800 mb-12 animate-fade-in">
          Get Started
        </h1>

        {/* Illustration */}
        <div className="mb-12 animate-slide-up">
          <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 mx-4">
            {/* Background leaves */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-4 right-8 w-12 h-20 bg-green-200 rounded-full opacity-40 transform rotate-12"></div>
              <div className="absolute bottom-8 left-4 w-8 h-16 bg-green-300 rounded-full opacity-30 transform -rotate-12"></div>
              <div className="absolute top-1/2 right-4 w-6 h-12 bg-green-200 rounded-full opacity-35 transform rotate-45"></div>
              <div className="absolute bottom-4 right-12 w-10 h-18 bg-green-300 rounded-full opacity-25 transform -rotate-30"></div>
            </div>

            {/* Main illustration content */}
            <div className="relative z-10 flex items-center justify-center space-x-6">
              {/* Documents */}
              <div className="space-y-3">
                <div className="bg-white border-2 border-green-300 rounded-lg p-3 w-20 h-28 flex flex-col items-center justify-center shadow-sm">
                  <div className="text-green-700 font-bold text-sm mb-2">
                    GST
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-10 h-1.5 bg-green-400 rounded"></div>
                    <div className="w-8 h-1.5 bg-green-400 rounded"></div>
                    <div className="w-10 h-1.5 bg-green-400 rounded"></div>
                    <div className="w-6 h-1.5 bg-green-400 rounded"></div>
                  </div>
                </div>
                <div className="bg-white border-2 border-green-300 rounded-lg p-3 w-20 h-28 flex flex-col items-center justify-center shadow-sm">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mb-2">
                    <CheckSquare className="w-3 h-3 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-10 h-1.5 bg-gray-300 rounded"></div>
                    <div className="w-8 h-1.5 bg-gray-300 rounded"></div>
                    <div className="w-10 h-1.5 bg-gray-300 rounded"></div>
                    <div className="w-6 h-1.5 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>

              {/* People and Shield */}
              <div className="flex flex-col items-center space-y-4">
                {/* Person standing with shield */}
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-700 rounded-full mb-1"></div>
                    <div className="w-12 h-16 bg-green-700 rounded-lg"></div>
                  </div>
                  <div className="bg-green-600 w-12 h-16 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Person sitting at desk */}
                <div className="flex items-end space-x-1">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-green-600 rounded-full mb-1"></div>
                    <div className="w-8 h-10 bg-green-600 rounded-lg"></div>
                  </div>
                  <div className="w-16 h-3 bg-green-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DEMZZI Button */}
        <div className="mb-8 animate-slide-up delay-300">
          <div className="bg-green-800 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg">
            DEMZZIXPERT
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed animate-fade-in delay-500">
          Fast & reliable GST, ITR, and Trademark services at your fingertips
        </p>

        {/* Loading indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Landing Page Component
function LandingPage() {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    if (session?.user && session.user.role === "ADMIN") {
      router.push("/administration");
      return;
    }
  }, [session]);

  return (
    <div className="min-h-screen relative bg-gray-50 pb-20 lg:pb-0">
      {/* Header - Desktop only */}

      <header className="hidden fixed bg-white shadow-sm lg:flex w-full items-center justify-between   z-20 ">
        <div className="mx-auto gap-52 flex max-w-8xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-black">DEMZZI<span className="text-green-700">XPERT</span></div>
          <nav className="flex text-[#1c2d25] font-medium tracking-wider items-center space-x-8">
            <Button variant="link" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="link" onClick={() => router.push("/services")}>
              Services
            </Button>
            <Button variant="link" onClick={() => router.push("/requests")}>
              Requests
            </Button>
            <Button variant="link" onClick={() => router.push("/about")}>
              About Us
            </Button>
            <Button variant="link" onClick={() => router.push("/contact")}>
              Contact
            </Button>
            {!session?.user ? (
              <Button
                onClick={() => router.push("/login")}
                className="bg-green-800 hover:bg-green-900 text-white px-6">
                Login | Sign Up
              </Button>
            ) : (
              <Button
                onClick={() => signOut()}
                className="bg-green-800 hover:bg-green-900 text-white px-6">
                Logout
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div className="text-xl font-bold text-green-800">DEMZZI<span className="text-green-700">XPERT</span></div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <div className="w-4 h-2 bg-green-600 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 md:min-h-screen bg-[#fbfdfa] flex flex-col justify-center items-center lg:px-6 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Content */}
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-7xl font-bold text-green-800 mb-6 leading-tight">
                Simplify Your Compliance with One Click
              </h1>
              <p className="text-gray-600 md:text-xl text-sm mb-8 leading-relaxed">
                Fast & reliable GST, ITR, and Trademark <br /> services at your
                fingertips.
              </p>
              <Button
                onClick={() => router.push("/services")}
                className="bg-green-800 hover:bg-green-900 text-white group-hover:translate-x-2 px-8 py-7 text-lg rounded-full group">
                <span className="group-hover:translate-x-2">
                  Start Registration
                </span>
                <ArrowRight
                  size={20}
                  className="ml-2 w-8 h-8  group-hover:translate-x-2 transition-transform"
                />
              </Button>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="relative hidden lg:block rounded-2xl p-20 ">
                {/* Background decorative elements */}
                <img src="hero-section.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Mobile */}
      {/* <section className="lg:hidden px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/gst")}
            className="bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl flex flex-col items-center space-y-2"
          >
            <CheckSquare className="w-8 h-8" />
            <span className="font-semibold">GST Registration</span>
          </Button>
          <Button
            onClick={() => router.push("/itr")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl flex flex-col items-center space-y-2"
          >
            <FileText className="w-8 h-8" />
            <span className="font-semibold">ITR Filing</span>
          </Button>
        </div>
      </section> */}

      {/* Services Section */}
      <ServicesSection />
      {/* Why Choose Us Section */}
      <section className="px-4 lg:px-6 py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-12 text-center lg:text-left">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Lightning-Fast Service */}
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-green-50 transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-xl mb-2">
                  Lightning-Fast Service
                </h3>
                <p className="text-gray-600">
                  Get your compliance done in record time with our streamlined
                  process.
                </p>
              </div>
            </div>

            {/* Government Certified Experts */}
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-green-50 transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-xl mb-2">
                  Government Certified Experts
                </h3>
                <p className="text-gray-600">
                  Our team consists of certified professionals with years of
                  experience.
                </p>
              </div>
            </div>

            {/* 100% Digital Process */}
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-green-50 transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Laptop className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-xl mb-2">
                  100% Digital Process
                </h3>
                <p className="text-gray-600">
                  Complete paperless experience from application to approval.
                </p>
              </div>
            </div>

            {/* Transparent Pricing */}
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-green-50 transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-xl mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-gray-600">
                  No hidden fees. What you see is what you pay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />

      <Footer />

      <MobileNav />
    </div>
  );
}
// components/TestimonialsSection.tsx
// components/TestimonialCard.tsx
import { Star } from "lucide-react";

function TestimonialCard({
  id,
  name,
  role,
  quote,
}: {
  id: string;
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg border border-gray-100">
      <div className="flex items-center mb-4 space-x-1 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
        ))}
      </div>
      <p className="text-gray-700 italic mb-4">“{quote}”</p>
      <div className="flex items-center space-x-3 mt-auto">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-green-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string; // alias for `review`
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          role: r.role,
          quote: r.review,
        }));
        setTestimonials(formatted);
      })
      .catch(() => {
        setTestimonials([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#f6fbf4] px-4 lg:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-12 text-center">
          What Our Clients Say
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-400">No testimonials available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import ServicesSection from "@/components/serviceSection";

function Footer() {

  const [data, setData] = useState<any>([]);


  useEffect(() => {
    fetch("/api/contact-details").then((res) => res.json()).then((data) => {
      setData(data);
    });
  },[])
  return (
    <footer className="bg-green-900 text-white px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand + Tagline */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">DEMZZI<span className="text-green-700">XPERT</span></h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Simplifying compliance for thousands of businesses with fast,
            affordable, and expert solutions.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/gst">GST Registration</Link></li>
            <li><Link href="/itr">ITR Filing</Link></li>
            <li><Link href="/trademark">Trademark Registration</Link></li>
            <li><Link href="/company">Company Incorporation</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Mail size={16} /> 
              <span className="break-all">{data.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> {data.phone}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> 
              <span>Mumbai, Maharashtra 40001, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12 text-center text-sm text-gray-400 border-t border-green-800 pt-6">
        © {new Date().getFullYear()} DEMZZIXPERT. All rights reserved.
      </div>
    </footer>
  );
}

// Main App Component
export default function HomePage() {
  const { hasSeenSplash, setHasSeenSplash } = useApp();

  const handleSplashComplete = () => {
    setHasSeenSplash(true);
  };

  return (
    <div className="relative">
      {!hasSeenSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <div className="animate-fade-in">
          <LandingPage />
        </div>
      )}
    </div>
  );
}
