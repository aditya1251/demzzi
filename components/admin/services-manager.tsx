"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { FileUploader } from "@/app/[form]/page";

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  timeline: string;
  features: string[];
  price: number;
  isActive: boolean;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load all services from backend
  const fetchServices = async () => {
    setLoading(true);
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = () => {
    setEditingService({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      timeline: "",
      features: [""],
      price: 0,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsDialogOpen(true);
  };

  // ... existing code ...

  const handleSaveService = async () => {
    if (!editingService) return;

    setIsSaving(true);

    const method = editingService.id ? "PUT" : "POST";
    const url = editingService.id
      ? `/api/admin/services/${editingService.id}`
      : `/api/admin/services`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      if (!res.ok) {
        throw new Error("Failed to save service");
      }

      await fetchServices();
      setIsDialogOpen(false);
      setEditingService(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    await fetchServices();
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingService) return;
    const newFeatures = [...editingService.features];
    newFeatures[index] = value;
    setEditingService({ ...editingService, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      features: [...editingService.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    if (!editingService) return;
    const newFeatures = editingService.features.filter((_, i) => i !== index);
    setEditingService({ ...editingService, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Manage Services
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Add, edit, or remove services offered by DEMZZI
          </p>
        </div>
        <Button
          onClick={handleAddService}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-500">No services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                      className="p-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-semibold">
                      ₹{service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Timeline:</span>
                    <span className="font-semibold">{service.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`font-semibold ${
                        service.isActive ? "text-green-600" : "text-red-600"
                      }`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 truncate">
                  Features: {service.features.join(", ")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingService?.id ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>

          {editingService && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingService.title}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter service title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="2999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter service description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Service Image</Label>
                <FileUploader
                  name="image"
                  value={editingService.imageUrl}
                  onUpload={(url) =>
                    setEditingService({
                      ...editingService,
                      imageUrl: url,
                    })
                  }
                  onError={(msg) => alert(`Image upload failed: ${msg}`)}
                  placeholder="Upload service image (JPG, PNG, PDF, etc.)"
                />
              </div>

              <div className="space-y-2">
                <Label>Timeline</Label>
                <Input
                  value={editingService.timeline}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      timeline: e.target.value,
                    })
                  }
                  placeholder="3-5 Days"
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                {editingService.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder="Enter feature"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={editingService.features.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingService.isActive}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      isActive: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="isActive">Service is active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveService}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Service"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
