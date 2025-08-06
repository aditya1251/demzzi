import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, Badge, Loader2 } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type:
    | "TEXT"
    | "TEXTAREA"
    | "NUMBER"
    | "FILE"
    | "DATE"
    | "DROPDOWN"
    | "CHECKBOX";
  placeholder: string;
  required: boolean;
  isFixed: boolean;
  options?: string[];
}

interface FormConfig {
  id: string;
  title: string;
  subtitle: string;
  fields: FormField[];
}

export function FormsManager() {
  const [formConfigs, setFormConfigs] = useState<FormConfig[]>([]);
  const [editingForm, setEditingForm] = useState<FormConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fieldTypes = [
    { value: "TEXT", label: "Text" },
    { value: "NUMBER", label: "Number" },
    { value: "DROPDOWN", label: "Select Dropdown" },
    { value: "TEXTAREA", label: "Textarea" },
    { value: "FILE", label: "File Image Upload" },
    { value: "DATE", label: "Date" },
    { value: "CHECKBOX", label: "Checkbox" },
  ];

  // Fetch services and their form fields
  useEffect(() => {
    const loadServices = async () => {
      const res = await fetch("/api/services");
      const services = await res.json();

      const servicesWithForms: FormConfig[] = await Promise.all(
        services.map(async (service: any) => {
          const formRes = await fetch(`/api/admin/services/${service.id}/form`);
          const fields = await formRes.json();

          return {
            id: service.id,
            title: service.title,
            subtitle: service.description,
            fields,
          };
        })
      );

      setFormConfigs(servicesWithForms);
      setLoading(false);
    };

    loadServices();
  }, []);

  const handleEditForm = (form: FormConfig) => {
    setEditingForm({ ...form });
    setIsDialogOpen(true);
    setPreviewMode(false);
  };

  const handleSaveForm = async () => {
    if (!editingForm) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/services/${editingForm.id}/form`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: editingForm.fields }),
      });

      if (res.ok) {
        setFormConfigs((prev) =>
          prev.map((f) => (f.id === editingForm.id ? editingForm : f))
        );
        setIsDialogOpen(false);
        setEditingForm(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = () => {
    if (!editingForm) return;
    const newField: FormField = {
      name: "",
      label: "",
      type: "TEXT",
      isFixed: false,
      placeholder: "",
      required: false,
    };
    setEditingForm({
      ...editingForm,
      fields: [...editingForm.fields, newField],
    });
  };

  const handleUpdateField = (index: number, field: FormField) => {
    if (!editingForm) return;
    const newFields = [...editingForm.fields];
    newFields[index] = field;
    setEditingForm({ ...editingForm, fields: newFields });
  };

  const handleRemoveField = (index: number) => {
    if (!editingForm) return;
    const newFields = editingForm.fields.filter((_, i) => i !== index);
    setEditingForm({ ...editingForm, fields: newFields });
  };

  const handleAddOption = (fieldIndex: number) => {
    if (!editingForm) return;
    const newFields = [...editingForm.fields];
    if (!newFields[fieldIndex].options) {
      newFields[fieldIndex].options = [];
    }
    newFields[fieldIndex].options!.push("");
    setEditingForm({ ...editingForm, fields: newFields });
  };

  const handleUpdateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    if (!editingForm) return;
    const newFields = [...editingForm.fields];
    newFields[fieldIndex].options![optionIndex] = value;
    setEditingForm({ ...editingForm, fields: newFields });
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    if (!editingForm) return;
    const newFields = [...editingForm.fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options!.filter(
      (_, i) => i !== optionIndex
    );
    setEditingForm({ ...editingForm, fields: newFields });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Form Builder
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Customize form fields for each service
        </p>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Cards for each form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {formConfigs.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">
                    {form.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{form.subtitle}</p>
                </div>
                <div className="flex space-x-1 sm:space-x-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditForm(form)}
                    className="p-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-gray-800">
                    {form.fields.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Total Fields
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-gray-800">
                    {form.fields.filter((f) => f.required).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Required
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                <div className="font-medium mb-1">Fields:</div>
                <div className="line-clamp-2">
                  {form.fields.map((f) => f.label).join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog renders form editor */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Edit Form: {editingForm?.title}
            </DialogTitle>
          </DialogHeader>

          {/* existing tabs render here */}
          {editingForm && (
            <Tabs
              value={previewMode ? "preview" : "edit"}
              onValueChange={(v) => setPreviewMode(v === "preview")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="edit" className="text-sm">
                  Edit Form
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-sm">
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-6">
                {/* Form Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Form Title</Label>
                    <Input
                      value={editingForm.title}
                      onChange={(e) =>
                        setEditingForm({
                          ...editingForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Form Subtitle</Label>
                    <Input
                      value={editingForm.subtitle}
                      onChange={(e) =>
                        setEditingForm({
                          ...editingForm,
                          subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Form Fields</h3>
                    <Button onClick={handleAddField} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  {editingForm.fields.map((field, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Field {index + 1}</h4>
                          {field.isFixed ? (
                            <Badge className="bg-red-500 text-white">
                              Fixed
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveField(index)}
                              className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Field Name</Label>
                            <Input
                              value={field.name}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  ...field,
                                  name: e.target.value,
                                })
                              }
                              placeholder="fieldName"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  ...field,
                                  label: e.target.value,
                                })
                              }
                              placeholder="Field Label"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value: FormField["type"]) =>
                                handleUpdateField(index, {
                                  ...field,
                                  type: value,
                                })
                              }>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field type">
                                  {
                                    fieldTypes.find(
                                      (t) => t.value === field.type
                                    )?.label
                                  }
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {fieldTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Placeholder</Label>
                            <Input
                              value={field.placeholder}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  ...field,
                                  placeholder: e.target.value,
                                })
                              }
                              placeholder="Enter placeholder"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${index}`}
                            checked={field.required}
                            onChange={(e) =>
                              handleUpdateField(index, {
                                ...field,
                                required: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor={`required-${index}`}>
                            Required field
                          </Label>
                        </div>

                        {field.type === "DROPDOWN" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Options</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddOption(index)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                            {field.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) =>
                                    handleUpdateOption(
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Option value"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveOption(index, optionIndex)
                                  }>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveForm}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700">
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Form"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-green-800 mb-2">
                        {editingForm.title}
                      </h2>
                      <p className="text-gray-600">{editingForm.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                      {editingForm.fields.map((field, index) => (
                        <div key={index} className="space-y-2">
                          <Label>
                            {field.label}{" "}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </Label>
                          {field.type === "DROPDOWN" ? (
                            <Select>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option, optionIndex) => (
                                  <SelectItem key={optionIndex} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "TEXTAREA" ? (
                            <textarea
                              placeholder={field.placeholder}
                              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                              rows={4}
                            />
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              className="h-12"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full mt-6 h-12 bg-green-600 hover:bg-green-700">
                      Submit
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
