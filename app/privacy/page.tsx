"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-green-800">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-green-800">🔐 Privacy Policy – DemzziXpert</h2>

          <p>
            <strong>Business Name:</strong> DemzziXpert <br />
            <strong>Registered Office:</strong> Kandivali East, Lokhandwala Complex, Mumbai – 400101, Maharashtra, India
          </p>

          <p>
            At DemzziXpert, we value your trust and are committed to protecting your personal and professional data.
            This Privacy Policy outlines how we collect, use, store, and protect the information you share with us.
          </p>

          {/* Sections */}
          <div>
            <h3 className="text-xl font-bold text-green-800">1. Information We Collect</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Full name, contact number, and email ID</li>
              <li>PAN, Aadhaar, business documents, GSTIN, etc.</li>
              <li>Any supporting documents required for GST, ITR, Trademark, FSSAI, or related filings</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Filing and registration processes (e.g. GST, ITR, Trademark, FSSAI)</li>
              <li>Communicating service updates or document status</li>
              <li>Government submissions, where applicable</li>
              <li>Internal record-keeping and invoicing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">3. Data Retention & Deletion</h3>
            <p>
              We retain your submitted documents for a maximum of 7 days after registration or service initiation.
              After 7 days, all documents are permanently deleted from our system and backups. We do not share, sell,
              or reuse your documents or personal information for any reason beyond the scope of the service you
              request.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">4. Data Security</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>All documents are stored on secure systems with restricted access.</li>
              <li>Data shared over WhatsApp or email is kept confidential.</li>
              <li>We take strict measures to prevent unauthorized access, data breaches, or misuse.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">5. Third-Party Disclosure</h3>
            <p>
              We only share information with government portals (like GSTN, MCA, FSSAI, IT Department) when necessary
              for filing. We do not disclose your data to any third parties for marketing or unrelated purposes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">6. Client Responsibility</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Documents submitted must be correct, valid, and belong to the client.</li>
              <li>Communication channels (WhatsApp, phone, email) should remain active during service delivery.</li>
              <li>Clients should download or store their own copies of submitted/approved documents.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">7. Changes to Privacy Policy</h3>
            <p>
              We may update this policy from time to time. Clients are advised to review this page periodically.
              Changes will be posted with a revised effective date.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-800">8. Contact Us</h3>
            <p>
              For questions or concerns regarding your data or this Privacy Policy, please contact: <br />
              📧 Email: [your email] <br />
              📞 Phone/WhatsApp: [your number]
            </p>
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  )
}
