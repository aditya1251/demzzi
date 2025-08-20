// components/ServiceFormInline.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import axios from "axios";
import { FileUploader } from "@/app/[form]/page";

export default function FormInline({
  serviceId,
  formFields,
}: {
  serviceId: string;
  formFields: any[];
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    formFields?.forEach((f: any) => {
      const v = (formData[f.name] || "").trim();
      if (f.required && !v) errs[f.name] = `${f.label} is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  console.log(formFields);

  const submit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("/api/submissions", { serviceId, formData });
      setDone(true);
      setFormData({});
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <Check className="text-green-700" />
        </div>
        <div className="font-medium text-green-800">
          Thanks! We'll contact you soon.
        </div>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => setDone(false)}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {formFields?.map((field: any) => (
        <div key={field.name} className="space-y-1">
          <Label className="text-sm">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </Label>

          {/* Render based on field.type */}
          {field.type === "TEXT" && (
            <Input
              type="text"
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          )}

          {field.type === "TEXTAREA" && (
            <textarea
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="mt-1 w-full rounded-lg border p-3"
              rows={4}
            />
          )}

          {field.type === "NUMBER" && (
            <Input
              type="number"
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          )}

          {field.type === "DATE" && (
            <Input
              type="date"
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}

          {field.type === "DROPDOWN" && (
            <select
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="mt-1 w-full rounded-lg border p-3">
              <option value="">{field.placeholder ?? "Choose"}</option>
              {field.options?.map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === "CHECKBOX" && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData[field.name] === "true"}
                onChange={(e) =>
                  handleChange(field.name, e.target.checked ? "true" : "")
                }
                className="h-4 w-4 border rounded"
              />
              <span className="text-sm">{field.placeholder}</span>
            </div>
          )}

          {field.type === "FILE" && (
            <FileUploader
              name={field.name}
              value={formData[field.name] || ""}
              onUpload={(url) => handleChange(field.name, url)}
              onError={(msg) => setErrors((e) => ({ ...e, [field.name]: msg }))}
              placeholder={field.placeholder}
            />
          )}

          {/* Error messages */}
          {errors[field.name] && (
            <div className="text-xs text-red-500 mt-1">
              {errors[field.name]}
            </div>
          )}
        </div>
      ))}

      <Button
        type="submit"
        className="w-full mt-2 bg-green-800 hover:bg-green-900"
        disabled={loading}>
        {loading ? "Sending..." : "Get Started"}
      </Button>
    </form>
  );
}
