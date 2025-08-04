import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your account and clients",
}

export default function AdminPage() {
  
  return (
    <div className="min-h-screen bg-gray-50">
        <AdminDashboard />
    </div>
  )
}
