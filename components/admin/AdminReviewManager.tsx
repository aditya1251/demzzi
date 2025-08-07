"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Trash2, Save, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // assumes you're using shadcn/ui

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
}

export default function AdminReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    role: "",
    rating: 5,
    review: "",
  });

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load reviews.");
        setLoading(false);
      });
  }, []);

  const handleChange = (id: string, field: keyof Review, value: string | number) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, [field]: value } : review
      )
    );
  };

  const handleSave = async (id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;

    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (!res.ok) throw new Error();
      toast.success("Review updated.");
    } catch {
      toast.error("Failed to update review.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) throw new Error();
      const created = await res.json();
      setReviews((prev) => [created, ...prev]);
      setNewReview({ name: "", role: "", rating: 5, review: "" });
      toast.success("New review added.");
    } catch {
      toast.error("Failed to add review.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <Card>
      <CardContent className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Manage Reviews</h2>

          {/* Dialog Trigger */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Review</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({ ...newReview, rating: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Review</Label>
                  <Textarea
                    value={newReview.review}
                    onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                  />
                </div>

                <Button onClick={handleAdd} disabled={adding} className="w-full mt-4">
                  {adding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Review"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews available.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-4 border p-4 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={review.name}
                    onChange={(e) => handleChange(review.id, "name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={review.role}
                    onChange={(e) => handleChange(review.id, "role", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={review.rating}
                    onChange={(e) =>
                      handleChange(review.id, "rating", parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Review</Label>
                  <Textarea
                    value={review.review}
                    onChange={(e) => handleChange(review.id, "review", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  onClick={() => handleSave(review.id)}
                  disabled={savingId === review.id}
                >
                  {savingId === review.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
