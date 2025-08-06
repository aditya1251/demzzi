"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  Eye,
  Inbox,
  FileText,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

type ServiceRequest = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  status: "new" | "in-progress" | "completed" | "cancelled";
  requestDate: string;
  timeAgo: string;
  description: string;
};

type Submission = {
  service: string;
  submittedAt: string;
  formData: Record<string, any>;
};

export function RecentRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    async function loadRequests() {
      const resp = await fetch(
        `/api/admin/requests?search=${encodeURIComponent(
          searchTerm
        )}&status=${encodeURIComponent(statusFilter)}`
      );
      const data = await resp.json();
      setRequests(data.requests);
    }
    loadRequests();
  }, [searchTerm, statusFilter]);

  const statusCounts = {
    new: requests.filter((r) => r.status === "new").length,
    inProgress: requests.filter((r) => r.status === "pending").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  const getStatusColor = (status: string) =>
    ({
      new: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }[status] || "bg-gray-100 text-gray-800");

  const handleStatusChange = async (
    id: string,
    newStatus: ServiceRequest["status"]
  ) => {
    await fetch(`/api/admin/requests/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const openDialog = async (id: string) => {
    setSelectedRequestId(id);
    setDialogOpen(true);
    const resp = await fetch(`/api/admin/requests/${id}`);
    const data = await resp.json();
    setSubmissions(data.submissions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="text-blue-600 w-6 h-6" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recent Requests</h1>
          <p className="text-sm text-gray-600">
            Manage service requests submitted by clients
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "New",
            icon: <Inbox className="w-5 h-5 text-blue-600" />,
            count: statusCounts.new,
          },
          {
            label: "Pending",
            icon: <Clock className="w-5 h-5 text-yellow-600" />,
            count: statusCounts.inProgress,
          },
          {
            label: "Completed",
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
            count: statusCounts.completed,
          },
          {
            label: "Cancelled",
            icon: <FileText className="w-5 h-5 text-red-600" />,
            count: statusCounts.cancelled,
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-xl font-bold">{item.count}</p>
              </div>
              {item.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 text-gray-400 w-4 h-4 transform -translate-y-1/2" />
            <Input
              placeholder="Search by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id} className="transition hover:shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {req.serviceType}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    {req.timeAgo}
                  </div>
                </div>
                <Badge className={getStatusColor(req.status)}>
                  {req.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {req.clientName}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {req.clientEmail}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {req.clientPhone}
                </div>
              </div>

              <p className="text-sm text-gray-600">{req.description}</p>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3">
                <Select
                  value={req.status}
                  onValueChange={(val) =>
                    handleStatusChange(req.id, val as ServiceRequest["status"])
                  }>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => openDialog(req.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Submissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty */}
      {requests.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-gray-500">
            No requests match your filters.
          </CardContent>
        </Card>
      )}

      {/* Submissions Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              User Submissions
            </DialogTitle>
          </DialogHeader>

          {submissions.length > 0 ? (
            submissions.map((s, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
                <p className="text-xs text-gray-500 mb-2">
                  Submitted on: {s.submittedAt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(s.formData).map(([k, v]) => {
                    const value = v ?? "";
                    const isString = typeof value === "string";
                    const isUrl = isString && value.startsWith("http");

                    return (
                      <div key={k} className="flex flex-col gap-2">
                        {isUrl && (
                          <img
                            src={String(value)}
                            alt={k}
                            className="w-full max-h-48 object-contain rounded-md"
                          />
                        )}

                        <div>
                          <p className="text-xs text-gray-500">{k}</p>
                          <p className="text-sm font-medium text-gray-800 break-words">
                            {isUrl ? (
                              <a
                                href={String(value)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline">
                                {String(value)}
                              </a>
                            ) : (
                              String(value)
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Loading....</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
