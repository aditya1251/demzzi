"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Award, Clock, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"

export default function AboutPage() {
  const router = useRouter()

  const stats = [
    { number: "10,000+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "99%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ]

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      experience: "15+ years in compliance",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      experience: "12+ years in tax consulting",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Amit Patel",
      role: "Legal Advisor",
      experience: "10+ years in corporate law",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
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
          <h2 className="text-3xl font-bold mb-4">About DEMZZI</h2>
          <p className="text-green-100 text-lg">Your trusted partner for all compliance needs</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Founded in 2019, DEMZZI was born out of a simple idea: to make business compliance accessible, affordable,
              and hassle-free for everyone. We recognized that small businesses and entrepreneurs often struggle with
              complex regulatory requirements, and we set out to change that.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
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
              <h3 className="text-xl font-bold text-green-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize business compliance by providing fast, reliable, and affordable services that help
                businesses focus on what they do best - growing their business.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become India's most trusted compliance partner, empowering millions of businesses to achieve their
                full potential without regulatory hurdles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Trust & Transparency</h3>
                    <p className="text-gray-600">We believe in complete transparency in our processes and pricing.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Speed & Efficiency</h3>
                    <p className="text-gray-600">We value your time and ensure quick turnaround times.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Excellence</h3>
                    <p className="text-gray-600">We strive for excellence in everything we do.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Customer First</h3>
                    <p className="text-gray-600">Our customers are at the heart of everything we do.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  )
}
