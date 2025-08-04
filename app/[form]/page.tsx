"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  let formType = params.form as string;

  if ( formType === "gst"){
    formType = "cmdw5awh50001zv3077f8mo9f"
  }

  const [formConfig, setFormConfig] = useState<{
    title: string;
    subtitle: string;
    fields: {
      name: string;
      label: string;
      type: string;
      placeholder: string;
      required: boolean;
      options?: string[];
    }[];
  } | null>(null);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/services/${formType}/form`);
        if (!res.ok) throw new Error("Form not found");

        const data = await res.json();
        setFormConfig(data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (formType) fetchForm();
  }, [formType]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    formConfig?.fields.forEach((field) => {
      const value = formData[field.name]?.trim() || "";
      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.name === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }

      if (field.name === "phone" && value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
          newErrors[field.name] = "Please enter a valid 10-digit phone number";
        }
      }

      if (field.name === "pan" && value) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(value.toUpperCase())) {
          newErrors[field.name] = "Please enter a valid PAN number";
        }
      }

      if (field.name === "pinCode" && value) {
        const pinRegex = /^[1-9][0-9]{5}$/;
        if (!pinRegex.test(value)) {
          newErrors[field.name] = "Please enter a valid 6-digit pin code";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          serviceId: formType,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your form.</p>
        </div>
      </div>
    );
  }

  if (notFound || !formConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Form Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested form does not exist.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-green-800 hover:bg-green-900">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your {formConfig.title.toLowerCase()} details.
            Our team will contact you within 24 hours.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-green-800 hover:bg-green-900">
              Back to Home
            </Button>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({});
                setErrors({});
              }}
              variant="outline"
              className="w-full">
              Submit Another Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Headers */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <div className="w-4 h-2 bg-green-600 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-800 rounded-sm"></div>
        </div>
      </header>

      <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-2xl font-bold text-green-800">DEMZZI</div>
        </div>
      </header>

      {/* Form */}
      <div className="px-4 lg:px-6 py-8 lg:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-green-800 mb-2">
              {formConfig.title}
            </h1>
            <p className="text-gray-600 text-lg">{formConfig.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formConfig.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {field.type === "select" ? (
                  <Select
                    value={formData[field.name] || ""}
                    onValueChange={(value) => handleInputChange(field.name, value)}>
                    <SelectTrigger className="w-full h-14 rounded-xl border-2 border-gray-300 focus:border-green-500">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="h-14 rounded-xl border-2 border-gray-300 focus:border-green-500 text-base"
                  />
                )}

                {errors[field.name] && (
                  <p className="text-red-500 text-sm">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-green-800 hover:bg-green-900 text-white text-lg font-semibold rounded-xl">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Your information is secure and will be used only for processing your{" "}
              {formType.toUpperCase()} application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
