import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import ServicesSection from "@/components/serviceSection";
import ServicesPage from "@/components/SearchBar";
import { useEffect, useState } from "react";

export default function Footer() {

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