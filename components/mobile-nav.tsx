"use client";

import { Home, FileText, CreditCard, User, Phone, History } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Services", href: "/services" },
  { icon: History, label: "Requests", href: "/requests" },
  { icon: User, label: "About", href: "/about" },
  { icon: Phone, label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show nav on form pages
  if (pathname.includes("/gst") || pathname.includes("/itr")) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-green-600"
              )}>
              <Icon className={cn("w-5 h-5 mb-1", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
