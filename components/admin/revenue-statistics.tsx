"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

interface RevenueEntry {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  month: string;
}

export function RevenueStatistics() {
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<RevenueEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = [
    "GST Registration",
    "ITR Filing",
    "Trademark",
    "Company Registration",
    "Other",
  ];

  // Fetch real data
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch("/api/admin/revenue");
        if (!res.ok) throw new Error("Failed to fetch revenue");
        const data = await res.json();

        const mapped = data.map((item: any) => ({
          id: item.id,
          amount: item.amount,
          category: item.label || "Other",
          description: item.note || "",
          date: item.createdAt.split("T")[0],
          month: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        }));

        setRevenueEntries(mapped);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      }
    };

    fetchRevenue();
  }, []);

  const handleAddEntry = () => {
    setEditingEntry({
      id: "",
      amount: 0,
      category: "GST Registration",
      description: "",
      date: new Date().toISOString().split("T")[0],
      month: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    });
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry: RevenueEntry) => {
    setEditingEntry({ ...entry });
    setIsDialogOpen(true);
  };

  const handleSaveEntry = async () => {
    if (!editingEntry) return;

    const payload = {
      amount: editingEntry.amount,
      label: editingEntry.category,
      note: editingEntry.description,
      createdAt: editingEntry.date,
      source: "MANUAL",
    };

    try {
      let response;
      if (editingEntry.id) {
        // PATCH
        response = await fetch(`/api/admin/revenue/${editingEntry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // POST
        response = await fetch("/api/admin/revenue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Failed to save entry");

      const newEntry = await response.json();

      if (editingEntry.id) {
        setRevenueEntries((prev) =>
          prev.map((e) =>
            e.id === editingEntry.id ? { ...editingEntry, ...newEntry } : e
          )
        );
      } else {
        setRevenueEntries((prev) => [
          ...prev,
          {
            ...editingEntry,
            id: newEntry.id,
            month: new Date(editingEntry.date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          },
        ]);
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save revenue entry");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/revenue/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setRevenueEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete entry");
    }
  };

  const totalRevenue = revenueEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );
  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const currentMonthRevenue = revenueEntries
    .filter((entry) => entry.month === currentMonth)
    .reduce((sum, entry) => sum + entry.amount, 0);

  const categoryTotals = categories
    .map((category) => ({
      category,
      total: revenueEntries
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Revenue Statistics
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track and manage revenue entries
          </p>
        </div>
        <Button
          onClick={handleAddEntry}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Revenue Entry
        </Button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{currentMonthRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                <p className="text-2xl font-bold text-gray-800">
                  {revenueEntries.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTotals.map((item) => (
              <div key={item.category} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {item.category}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{item.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {((item.total / totalRevenue) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h3 className="font-semibold text-gray-800">
                      {entry.category}
                    </h3>
                    <span className="text-sm text-gray-600">{entry.month}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {entry.description}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ₹{entry.amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEntry(entry)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingEntry?.id ? "Edit Revenue Entry" : "Add Revenue Entry"}
            </DialogTitle>
          </DialogHeader>

          {editingEntry && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={editingEntry.amount}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      amount: Number(e.target.value),
                    })
                  }
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editingEntry.category}
                  onValueChange={(value) =>
                    setEditingEntry({ ...editingEntry, category: value })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingEntry.description}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter description"
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editingEntry.date}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, date: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEntry}
                  className="bg-green-600 hover:bg-green-700">
                  Save Entry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
