"use client";

import { useRouter } from "next/navigation";
import {
  Info,
  Shield,
  Gavel,
  LogOut,
  LogIn,
  User,
  ArrowLeft,
  History,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

const menuItems = [
  { icon: Info, label: "About Us", href: "/about" },
  { icon: History, label: "Requests", href: "/requests" },
  { icon: Shield, label: "Privacy Policy", href: "/privacy" },
  { icon: Gavel, label: "Terms & Conditions", href: "/terms" },
];

export default function MenuPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && session?.user;

  const handleLogin = () => router.push("/login");
  const handleLogout = () => signOut();
  const handleNavigate = (href: string) => router.push(href);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex-1 p-0">
        <div className="flex items-center space-x-3 p-2 justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-green-800">Back</h1>
        </div>{" "}
        <div className="bg-green-600 rounded-b-3xl p-6 shadow-sm">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center text-xl font-bold uppercase text-white">
                  {session.user.name?.charAt(0) || <User className="w-6 h-6" />}
                </div>
              )}
              <div className="text-white">
                <h2 className="text-lg font-semibold">{session.user.name}</h2>
                <p className="text-sm opacity-80 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-white">
                  <h2 className="text-lg font-semibold">Guest</h2>
                  <p className="text-sm opacity-80">You're not logged in</p>
                </div>
              </div>
              <Button
                onClick={handleLogin}
                className="bg-white text-green-600 hover:bg-green-100 transition">
                <LogIn className="w-5 h-5 mr-2" />
                Log In
              </Button>
            </div>
          )}
        </div>
        {/* Menu Items */}
        <nav className="px-4 pt-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigate(item.href)}
              className="w-full flex items-center gap-4 p-4 text-left rounded-xl text-gray-800 hover:bg-green-50 transition">
              <item.icon className="w-5 h-5 text-green-600" />
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Auth Action - Logout only */}
      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200 bg-white">
          {isLoading ? (
            <p className="text-sm text-gray-500 text-center">
              Checking session...
            </p>
          ) : (
            <Button
              variant="destructive"
              className="w-full py-3 mb-20 text-base"
              onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          )}
        </div>
      )}

      <MobileNav />
    </div>
  );
}
