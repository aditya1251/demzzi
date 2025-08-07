"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  Settings,
  DollarSign,
  MessageSquare,
  LogOut,
  FileText,
  Contact2,
  Star,
} from "lucide-react"
import { UsersList } from "./users-list"
import { RevenueStatistics } from "./revenue-statistics"
import { RecentRequests } from "./recent-requests"
import { TaskManager } from "./task-manager"
import { ServicesManager } from "./services-manager"
import { PricingManager } from "./pricing-manager"
import { ContactManager } from "./contact-manager"
import AdminOverview from "./admin-overview"
import { signOut } from "next-auth/react"
import { FormsManager } from "./forms-manager"
import ContactDetailsEditor from "./ContactDetailsEditor"
import AdminReviewManager from "./AdminReviewManager"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    signOut()
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "revenue", label: "Revenue", icon: BarChart3 },
    { id: "requests", label: "Recent Requests", icon: Clock },
    { id: "services", label: "Services", icon: Settings },
    { id: "forms", label: "Form Builder", icon: FileText },
    // { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "contact", label: "Contact Us", icon: MessageSquare },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "contactDetails", label: "Contact Details", icon: Contact2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-lg sm:text-2xl font-bold text-green-800">DEMZZI Admin</div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-2 sm:px-4 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white border-b">
          <div className="flex overflow-x-auto px-4 py-2 space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  className="whitespace-nowrap flex-shrink-0"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {activeTab === "overview" && <AdminOverview />}

          {activeTab === "users" && <UsersList />}
          {activeTab === "revenue" && <RevenueStatistics />}
          {activeTab === "requests" && <RecentRequests />}
          {activeTab === "services" && <ServicesManager />}
          {activeTab === "forms" && <FormsManager />}
          {/* {activeTab === "pricing" && <PricingManager />} */}
          {activeTab === "contact" && <ContactManager />}
          {activeTab === "contactDetails" && <ContactDetailsEditor />}
          {activeTab === "reviews" && <AdminReviewManager />}

        </main>
      </div>
    </div>
  )
}
