// components/ServiceFormInline.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import axios from "axios";

export default function FormInline({ serviceId, formFields }: { serviceId: string; formFields: any[] }) {
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
        <div className="font-medium text-green-800">Thanks! We'll contact you soon.</div>
        <Button variant="outline" className="mt-3" onClick={() => setDone(false)}>Submit another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {formFields?.map((field: any) => (
        <div key={field.name}>
          <Label className="text-sm">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>

          {field.type === "select" ? (
            <select
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="mt-1 w-full rounded-lg border p-3"
            >
              <option value="">{field.placeholder ?? "Choose"}</option>
              {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <Input
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="mt-1"
            />
          )}

          {errors[field.name] && <div className="text-xs text-red-500 mt-1">{errors[field.name]}</div>}
        </div>
      ))}

      <Button type="submit" className="w-full mt-2 bg-green-800 hover:bg-green-900" disabled={loading}>
        {loading ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
