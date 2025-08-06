"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  Award,
  Clock,
  Shield,
  Lock,
  Phone,
  DollarSign,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { number: "1,000+", label: "Happy Clients" },
    { number: "2+", label: "Years Experience" },
    { number: "7 days", label: "Auto delete" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-green-800">About Us</h1>
          </div>
          <div className="lg:hidden flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="w-4 h-2 bg-green-600 rounded-sm"></div>
            <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
            <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
            <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About DemzziXpert</h2>
          <p className="text-green-100 text-lg">
            Your trusted partner for all compliance needs
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              DemzziXpert is a government-registered online service provider,
              proudly serving individuals, professionals, startups, and small
              businesses across India. Based in Kandivali East, Lokhandwala
              Complex, Mumbai – 400101, we specialize in hassle-free,
              affordable, and professional compliance services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We simplify complex government processes into smooth, fully
                online solutions, so you focus on your business while we handle
                the paperwork.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                At DemzziXpert, we believe in clarity, speed, and trust. Our
                expert team ensures every filing is accurate, on time, and in
                compliance with Indian laws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Trusted by 1000+ Clients
                    </h3>
                    <p className="text-gray-600">
                      Proven track record with satisfied customers nationwide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Privacy-first
                    </h3>
                    <p className="text-gray-600">
                      Documents are auto-deleted after 7 days for your safety.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Personal WhatsApp & Phone Support
                    </h3>
                    <p className="text-gray-600">
                      Direct access to experts no bots, no queues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Clear Refund Policy
                    </h3>
                    <p className="text-gray-600">
                      Full refund if filing not started or if the fault is ours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Fast Processing
                    </h3>
                    <p className="text-gray-600">
                      No delays, no agents—only skilled experts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  );
}
