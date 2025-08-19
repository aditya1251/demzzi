"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Zap, Laptop, BarChart3, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "./providers";
import { MobileNav } from "@/components/mobile-nav";
import { signOut, useSession } from "next-auth/react";
import ServicesShowcase from "@/components/serviceSection";
import ServicesSearchPage from "@/components/SearchBar";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialSection";
import SplashScreen from "@/components/SplashScreen";
import Tiptap from "@/components/Tiptap";

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
          <div className="text-2xl font-bold text-black">
            DEMZZI<span className="text-green-700">XPERT</span>
          </div>
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
        <div className="text-xl font-bold text-green-800">
          DEMZZI<span className="text-green-700">XPERT</span>
        </div>
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

      <ServicesSearchPage />

      {/* Services Section */}
      <ServicesShowcase />
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
