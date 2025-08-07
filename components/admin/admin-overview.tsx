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
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();

    if (["today", "week", "month", "all"].includes(filter)) {
      params.set("range", filter);
    } else if (filter === "customDate" && customDate) {
      params.set("date", customDate);
    } else if (filter === "customRange" && startDate && endDate) {
      params.set("start", startDate);
      params.set("end", endDate);
    }

    setLoading(true);
    fetch(`/api/admin/overview?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [filter, customDate, startDate, endDate]);

  const stats = data
    ? [
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
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Heading + Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to the DEMZZI admin panel</p>
        </div>
      
        <div className="flex flex-col sm:items-end gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="customDate">Custom Date</option>
            <option value="customRange">Custom Range</option>
          </select>
      
          {filter === "customDate" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
      
          {filter === "customRange" && (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-100 h-24" />
            ))
          : stats.map((stat, i) => (
              <Card key={i} className="hover:shadow transition">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-600 shadow-sm rounded flex items-center justify-center">
                    <stat.icon className="text-white w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 animate-pulse rounded"
                />
              ))}
            </div>
          ) : (
            (() => {
              const combined = [
                ...data!.recent.users.map((u) => ({
                  type: "user" as const,
                  createdAt: u.createdAt,
                  name: u.name,
                })),
                ...data!.recent.requests.map((r) => ({
                  type: "request" as const,
                  updatedAt: r.updatedAt,
                  service: r.service.title,
                })),
                ...data!.recent.revenues.map((rev) => ({
                  type: "revenue" as const,
                  createdAt: rev.createdAt,
                  amount: rev.amount,
                })),
              ].sort((a, b) => {
                const aTime = new Date(
                  "createdAt" in a
                    ? a.createdAt
                    : "updatedAt" in a
                    ? a.updatedAt
                    : 0
                ).getTime();
                const bTime = new Date(
                  "createdAt" in b
                    ? b.createdAt
                    : "updatedAt" in b
                    ? b.updatedAt
                    : 0
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
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
                        >
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
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
                        >
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
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Revenue updated: ₹
                              {item.amount.toLocaleString()}
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
            })()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
