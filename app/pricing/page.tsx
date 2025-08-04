"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ArrowLeft, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"

export default function PricingPage() {
  const router = useRouter()

  const plans = [
    {
      name: "GST Registration",
      price: "₹2,999",
      originalPrice: "₹4,999",
      popular: true,
      features: [
        "GST Registration Certificate",
        "Expert Consultation",
        "Document Preparation",
        "Government Fee Included",
        "3-5 Days Processing",
        "Email & Phone Support",
      ],
      action: () => router.push("/gst"),
    },
    {
      name: "ITR Filing",
      price: "₹1,499",
      originalPrice: "₹2,499",
      popular: false,
      features: [
        "All ITR Forms Supported",
        "Tax Calculation",
        "Refund Processing",
        "Expert Review",
        "1-2 Days Processing",
        "Free Consultation",
      ],
      action: () => router.push("/itr"),
    },
    {
      name: "Trademark Registration",
      price: "₹8,999",
      originalPrice: "₹12,999",
      popular: false,
      features: [
        "Trademark Search",
        "Application Filing",
        "Legal Documentation",
        "Government Fee Included",
        "12-18 Months Processing",
        "Renewal Reminders",
      ],
      action: () => {},
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
            <h1 className="text-xl font-bold text-green-800">Pricing</h1>
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
          <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-green-100 text-lg">No hidden fees. Choose the plan that works best for you.</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-lg transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-green-500 scale-105" : "hover:scale-105"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-green-600">{plan.price}</span>
                      <span className="text-lg text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      Save{" "}
                      {Math.round(
                        (1 -
                          Number.parseInt(plan.price.replace("₹", "").replace(",", "")) /
                            Number.parseInt(plan.originalPrice.replace("₹", "").replace(",", ""))) *
                          100,
                      )}
                      %
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={plan.action}
                    className={`w-full ${
                      plan.popular ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"
                    } text-white`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Are there any hidden charges?</h3>
              <p className="text-gray-600">
                No, our pricing is completely transparent. The price you see includes all our service charges and
                government fees where applicable.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">What if my application gets rejected?</h3>
              <p className="text-gray-600">
                We provide full support throughout the process. In case of rejection, we'll help you reapply at no
                additional cost.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Do you provide refunds?</h3>
              <p className="text-gray-600">
                Yes, we offer a full refund if we're unable to process your application due to our service limitations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  )
}
