'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DemzziXpertTerms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Back to home">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">Terms & Conditions — DemzziXpert</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Business Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                DemzziXpert is a government-registered service provider located in Kandivali East, Lokhandwala Complex, Mumbai - 400101.
                We provide online legal and tax-related services including GST registration & return filing, Income Tax Return (ITR) filing,
                trademark registration, and FSSAI (food license) registration.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Delivery</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All services are delivered online. After we receive payment and the required documents, our team will initiate the filing
                process. Clients must ensure submitted information is accurate and that documents are provided in the required format.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Service commencement begins only after full payment and receipt of required documents.</li>
                <li>Estimated processing times are provided where applicable; actual timelines depend on government authorities.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cancellation & Refund Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Once payment is made, order cancellation is not allowed except in the specific circumstances described below.
                </p>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 When Refunds Are Allowed</h3>
                  <p className="leading-relaxed">
                    A full refund will be granted only if:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>The filing process has not yet been started by DemzziXpert; or</li>
                    <li>The error or delay is solely due to DemzziXpert's action or omission.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 When Refunds Are Not Available</h3>
                  <p className="leading-relaxed">
                    No refund will be provided for delays, rejections, or other issues that arise from incorrect or incomplete information
                    supplied by the client, or for fees already paid to government authorities where those fees are non-refundable.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 How to Request a Refund</h3>
                  <p className="leading-relaxed">
                    To request a refund, contact our support team at the contact details below. Refund requests should include your order
                    reference and any supporting documentation. We will review refund requests and notify you of the decision within a
                    reasonable timeframe.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Document Handling & Data Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take client privacy seriously. Customer documents submitted for a service are retained securely for a period of 7 days
                after registration/completion. After 7 days, all files are permanently deleted from our systems to protect client privacy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Clients are responsible for keeping their own backups of documents. For details on how we collect, use, and protect your
                personal data, please refer to our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Client Responsibility</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate, complete, and valid documents and information.</li>
                <li>Respond to communications from DemzziXpert in a timely manner.</li>
                <li>Understand that DemzziXpert is not liable for delays caused by government processing or third-party systems.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Legal Compliance</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using our services you agree to comply with applicable Indian laws relating to taxation, registration, and intellectual
                property. DemzziXpert is not responsible for any misuse of services by clients after delivery or for legal consequences
                arising from client non-compliance.
              </p>

              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of India. Any disputes arising out of these Terms will be subject to the exclusive
                jurisdiction of the courts in Mumbai, India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website.
                Continued use of our services after changes are posted constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">If you have any questions about these Terms, contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@demzzixpert.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 98765 43210</p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Lokhandwala Complex, Kandivali East, Mumbai, Maharashtra 400101, India
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
