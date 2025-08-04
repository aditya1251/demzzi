"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BarChart3, Clock, CheckCircle } from "lucide-react";

interface OverviewData {
  stats: {
    userCount: number;
    revenue: number;
    pending: number;
    completed: number;
  };
  recent: {
    users: { name: string; createdAt: string }[];
    requests: {
      status: string;
      updatedAt: string;
      service: { title: string };
    }[];
    revenues: { amount: number; createdAt: string; label: string | null }[];
  };
}

export default function AdminOverview() {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  const stats = [
    {
      title: "Total Users",
      value: data.stats.userCount.toLocaleString(),
      icon: Users,
    },
    {
      title: "Revenue",
      value: `₹${data.stats.revenue.toLocaleString()}`,
      icon: BarChart3,
    },
    {
      title: "Pending Tasks",
      value: data.stats.pending.toString(),
      icon: Clock,
    },
    {
      title: "Completed",
      value: data.stats.completed.toString(),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the DEMZZI admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow transition">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`w-10 h-10 bg-green-600 shadow-sm rounded flex items-center justify-center`}>
                <stat.icon className="text-white w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

          {(() => {
            const combined = [
              ...data.recent.users.map((u) => ({
                type: "user" as const,
                createdAt: u.createdAt,
                name: u.name,
              })),
              ...data.recent.requests.map((r) => ({
                type: "request" as const,
                updatedAt: r.updatedAt,
                service: r.service.title,
              })),
              ...data.recent.revenues.map((rev) => ({
                type: "revenue" as const,
                createdAt: rev.createdAt,
                amount: rev.amount,
              })),
            ].sort((a, b) => {
              const aTime = new Date(
                "createdAt" in a ? a.createdAt : "updatedAt" in a ? a.updatedAt : 0
              ).getTime();
              const bTime = new Date(
                "createdAt" in b ? b.createdAt : "updatedAt" in b ? b.updatedAt : 0
              ).getTime();
              return bTime - aTime; // Newest first
            });

            return (
              <div className="space-y-4">
                {combined.map((item, i) => {
                  if (item.type === "user") {
                    return (
                      <div
                        key={`user-${i}`}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New user registered: {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (item.type === "request") {
                    return (
                      <div
                        key={`req-${i}`}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New request for {item.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (item.type === "revenue") {
                    return (
                      <div
                        key={`rev-${i}`}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Revenue updated: ₹{item.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
