"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Filter,
  Download,
  Mail,
  Calendar,
  ListOrdered,
  Users,
  ReceiptIndianRupee,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

interface UserDetail extends AdminUser {
  recentOrders: {
    id: string;
    serviceName: string;
    createdAt: string;
    amount: number;
    status: string;
  }[];
}

export function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExport = () => {
    const link = document.createElement("a");
    link.href = "/api/admin/users/export";
    link.download = "users.csv";
    link.click();
  };

  const handleViewUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      setSelectedUser(data);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch user detail:", err);
    }
  };

  const totalUsers = users.length;
  const totalOrders = users.reduce((sum, user) => sum + user.totalOrders, 0);
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading users...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage registered users and clients
          </p>
        </div>
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <ListOrdered className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <ReceiptIndianRupee className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                    <p className="text-sm text-gray-600">{user.location}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-sm text-gray-600">
                    Orders: {user.totalOrders}
                  </div>
                  <div className="text-sm text-gray-600">
                    Spent: ₹{user.totalSpent.toLocaleString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewUser(user.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              User Details
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedUser.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Contact Information
                  </h4>
                  <p>
                    <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                    {selectedUser.email}
                  </p>
                  <p>
                    <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                    {selectedUser.phone}
                  </p>
                  <p>
                    <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                    {selectedUser.location}
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Account Information
                  </h4>
                  <p>
                    <Calendar className="w-4 h-4 inline mr-2 text-gray-500" />
                    Joined:{" "}
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </p>
                  <p>
                    Total Orders: <strong>{selectedUser.totalOrders}</strong>
                  </p>
                  <p>
                    Total Spent:{" "}
                    <strong>₹{selectedUser.totalSpent.toLocaleString()}</strong>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Recent Orders
                </h4>
                <div className="space-y-2">
                  {selectedUser.recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent orders</p>
                  ) : (
                    selectedUser.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.serviceName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-semibold">₹{order.amount}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
