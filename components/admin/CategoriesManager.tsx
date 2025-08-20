"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GripVertical, ListOrdered } from "lucide-react";
import { FileUploader } from "@/app/[form]/page";

import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Service {
  id: string;
  title: string;
  priority: number;
  isDeleted: boolean;
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  priority: number;
  isDeleted: boolean;
  services?: Service[];
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? "2px dashed #4ade80" : "none",
    borderRadius: "0.75rem",
    backgroundColor: isDragging ? "#f0fdf4" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded-t-lg cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="text-gray-500" />
        <span className="text-xs text-gray-400">Drag</span>
      </div>
      {children}
    </div>
  );
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] =
    useState<Category | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);

    await fetch("/api/admin/categories/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: newCategories.map((c) => c.id) }),
    });
  };

  const handleServiceDragEnd = async (event: any, categoryId: string) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const categoryIndex = categories.findIndex((c) => c.id === categoryId);
  if (categoryIndex === -1) return;

  const category = categories[categoryIndex];
  const oldIndex = category.services.findIndex((s) => s.id === active.id);
  const newIndex = category.services.findIndex((s) => s.id === over.id);

  const newServices = arrayMove(category.services, oldIndex, newIndex);

  // update state
  const updatedCategories = [...categories];
  updatedCategories[categoryIndex] = {
    ...category,
    services: newServices,
  };
  setCategories(updatedCategories);

  // also update activeServiceCategory so dialog re-renders
  setActiveServiceCategory({
    ...category,
    services: newServices,
  });

  await fetch(`/api/admin/services/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderedIds: newServices.map((s) => s.id),
      categoryId,
    }),
  });
};



  const handleAddCategory = () => {
    setEditingCategory({
      id: "",
      name: "",
      imageUrl: "",
      priority: categories.length + 1,
      isDeleted: false,
      services: [],
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    setIsSaving(true);

    const method = editingCategory.id ? "PUT" : "POST";
    const url = editingCategory.id
      ? `/api/admin/categories/${editingCategory.id}`
      : `/api/admin/categories`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      if (!res.ok) throw new Error("Failed to save category");

      await fetchCategories();
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    await fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Manage Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Add, edit, reorder (drag), or remove categories
          </p>
        </div>
        <Button
          onClick={handleAddCategory}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <SortableItem key={category.id} id={category.id}>
                  <Card className="hover:shadow-lg transition-shadow rounded-b-lg">
                    <CardContent className="p-4 sm:p-6">
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                          {category.name}
                        </h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveServiceCategory(category)}
                          >
                            <ListOrdered className="w-4 h-4 text-blue-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs">
                        Slug: {category.slug}
                      </p>
                    </CardContent>
                  </Card>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Category Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingCategory?.id ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Category name"
                />
              </div>

              <div className="space-y-2">
                <Label>Category Image</Label>
                <FileUploader
                  name="image"
                  value={editingCategory.imageUrl}
                  onUpload={(url) =>
                    setEditingCategory({
                      ...editingCategory,
                      imageUrl: url,
                    })
                  }
                  onError={(msg) => alert(`Image upload failed: ${msg}`)}
                  placeholder="Upload category image"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCategory}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Reorder Dialog */}
      <Dialog
        open={!!activeServiceCategory}
        onOpenChange={() => setActiveServiceCategory(null)}
      >
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>
              Reorder Services ({activeServiceCategory?.name})
            </DialogTitle>
          </DialogHeader>

          {activeServiceCategory?.services && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) =>
                handleServiceDragEnd(e, activeServiceCategory.id)
              }
            >
              <SortableContext
                items={activeServiceCategory.services.map((s) => s.id)}
                strategy={rectSortingStrategy}
              >
                <div className="space-y-3">
                  {activeServiceCategory.services.map((service) => (
                    <SortableItem key={service.id} id={service.id}>
                      <Card>
                        <CardContent className="p-3">
                          <p className="font-medium">{service.title}</p>
                        </CardContent>
                      </Card>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
