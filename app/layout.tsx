import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DEMZZI XPERT - Simplify Your Compliance",
    template: "%s | DEMZZI XPERT", // every page can set its own title
  },
  description:
    "Fast & reliable GST, ITR, and Trademark services at your fingertips.",
  keywords: [
    "GST registration",
    "ITR filing",
    "Trademark services",
    "Compliance services",
    "Business registration",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.demzzixpert.online",
    siteName: "DEMZZI XPERT",
    title: "DEMZZI XPERT - Simplify Your Compliance",
    description:
      "Fast & reliable GST, ITR, and Trademark services at your fingertips.",
    images: [
      {
        url: "/og-image.png", // create this image for sharing preview
        width: 1200,
        height: 630,
        alt: "DEMZZI XPERT - Simplify Your Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@demzzixpert", // update with your Twitter handle if you have one
    title: "DEMZZI XPERT - Simplify Your Compliance",
    description:
      "Fast & reliable GST, ITR, and Trademark services at your fingertips.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#0f172a", // change to match brand color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* JSON-LD Schema for LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "DEMZZI",
              url: "https://www.demzzixpert.online",
              logo: "https://www.demzzixpert.online/logo.png",
              description:
                "Fast & reliable GST, ITR, and Trademark services at your fingertips.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mumbai",
                addressRegion: "Maharashtra",
                addressCountry: "India",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-1169270072",
                contactType: "Customer Service",
              },
            }),
          }}
        />

        {/* JSON-LD Schema for Site Navigation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "SiteNavigationElement",
                  position: 1,
                  name: "Home",
                  url: "https://www.demzzixpert.online/",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 2,
                  name: "GST Registration",
                  url: "https://www.demzzixpert.online/services/gst-registration",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 3,
                  name: "ITR Filing",
                  url: "https://www.demzzixpert.online/services/itr-filing",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 4,
                  name: "All Services",
                  url: "https://www.demzzixpert.online/services",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 5,
                  name: "Contact Us",
                  url: "https://www.demzzixpert.online/contact",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
