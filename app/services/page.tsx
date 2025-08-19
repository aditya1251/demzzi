// app/services/page.tsx
import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Our Services | DemzziXpert",
  description:
    "Explore professional business compliance services including GST registration, ITR filing, company incorporation, and more. Simplify compliance and grow your business with ease.",
  keywords: [
    "GST Registration",
    "ITR Filing",
    "Company Incorporation",
    "Business Compliance",
    "Startup Services",
    "Legal Services India",
  ],
  openGraph: {
    title: "Our Services | DemzziXpert",
    description:
      "Expert compliance services designed to help your business grow. From GST to ITR, we’ve got you covered.",
    url: "https://www.demzzixpert.online/services",
    siteName: "DemzziXpert",
    images: [
      {
        url: "https://www.demzzixpert.online/og-services.jpg",
        width: 1200,
        height: 630,
        alt: "Business Compliance Services",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services | DemzziXpert",
    description:
      "Explore GST, ITR, company incorporation, and other compliance services to boost your business.",
    images: ["https://www.demzzixpert.online/og-services.jpg"],
  },
  alternates: {
    canonical: "https://www.demzzixpert.online/services",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
