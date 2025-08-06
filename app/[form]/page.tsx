"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { ArrowLeft, CheckCircle, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  let formType = (params.form as string) || "";

  if (formType === "gst") {
    formType = "cmdw5awh50001zv3077f8mo9f";
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
      const value = (formData[field.name] || "").trim();
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Form Not Found</h1>
          <p className="text-gray-600 mb-6">The requested form does not exist.</p>
          <Button onClick={() => router.push("/")} className="bg-green-800 hover:bg-green-900">
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
          <h2 className="text-2xl font-bold text-green-800 mb-4">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your {formConfig.title.toLowerCase()} details. Our team will contact you within 24 hours.
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push("/")} className="w-full bg-green-800 hover:bg-green-900">
              Back to Home
            </Button>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({});
                setErrors({});
              }}
              variant="outline"
              className="w-full"
            >
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
            <h1 className="text-3xl lg:text-4xl font-bold text-green-800 mb-2">{formConfig.title}</h1>
            <p className="text-gray-600 text-lg">{formConfig.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formConfig.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {field.type === "select" ? (
                  <Select value={formData[field.name] || ""} onValueChange={(value) => handleInputChange(field.name, value)}>
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
                ) : field.type === "file" || field.type === "upload" ? (
                  <FileUploader
                    name={field.name}
                    value={formData[field.name]}
                    onUpload={(url) => handleInputChange(field.name, url)}
                    onError={(msg) => setErrors((prev) => ({ ...prev, [field.name]: msg }))}
                    placeholder={field.placeholder}
                  />
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

                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
              </div>
            ))}

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-green-800 hover:bg-green-900 text-white text-lg font-semibold rounded-xl"
              >
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

/**
 * FileUploader - inline uploader component
 *
 * Props:
 * - name: field name
 * - value: current url string (optional)
 * - onUpload: (url) => void, called when upload succeeds
 * - onError: (msg) => void, called when upload fails
 * - placeholder: string
 */

import {  useRef, } from "react";

import Image from "next/image"; // optional, remove if not using next
import {  FileText, Video, Image as ImageIcon } from "lucide-react";

type FileUploaderProps = {
  name: string;
  value?: string;
  onUpload: (url: string) => void;
  onError?: (msg: string) => void;
  placeholder?: string;
};

function FileUploader({
  name,
  value,
  onUpload,
  onError,
  placeholder,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // auto-start upload when a new file is selected
  useEffect(() => {
    if (file) {
      startUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // reset previous state
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      setProgress(0);
      setProcessing(false);
      setUploading(false);
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "video/*": [],
    },
    multiple: false,
  });

  const startUpload = async (f: File) => {
    setUploading(true);
    setProcessing(false);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", f, f.name);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setProgress(percent);
            if (percent >= 100) {
              // show processing state until server returns
              setProcessing(true);
            }
          }
        },
      });

      // expecting { url: "https://..." } from your API
      const uploadedUrl = res.data?.url;
      if (!uploadedUrl) {
        throw new Error("No URL returned from upload");
      }

      setProcessing(false);
      setUploading(false);
      setProgress(100);
      abortRef.current = null;

      // notify parent
      onUpload(uploadedUrl);
    } catch (err: any) {
      if (axios.isCancel(err) || err.name === "CanceledError") {
        // upload cancelled by user — do not call onError for normal cancellation
        setUploading(false);
        setProcessing(false);
        setProgress(0);
        return;
      }
      console.error("Upload error:", err);
      setUploading(false);
      setProcessing(false);
      setProgress(0);
      abortRef.current = null;
      onError?.("Upload failed. Please try again.");
    }
  };

  const removeFile = () => {
    // cancel any ongoing upload
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setFile(null);
    setProgress(0);
    setProcessing(false);
    setUploading(false);
    // clear previously uploaded value (optional)
    onUpload("");
  };

  const renderPreview = () => {
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPdf = file.type === "application/pdf";

      // local preview URL
      const previewUrl = URL.createObjectURL(file);

      return (
        <div className="relative w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-gray-50">
          <div className="w-full h-40 relative bg-gray-100 flex items-center justify-center">
            {isImage ? (
              // Using next/image is optional — replace with <img /> if not using Next.js
              <img
                src={previewUrl}
                alt={file.name}
                className="object-cover w-full h-full"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
            ) : isVideo ? (
              <video src={previewUrl} className="w-full h-full object-cover" />
            ) : isPdf ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <FileText className="w-10 h-10 text-gray-400" />
                <span className="text-xs text-gray-600 mt-1">PDF</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
            )}

            {/* blue progress overlay */}
            {(uploading || progress > 0) && (
              <div
                className="absolute left-0 bottom-0 w-full"
                aria-hidden
              >
                <div className="h-2 w-full bg-blue-100/60">
                  <div
                    className="h-2 bg-blue-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* progress percent on top */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-full bg-black/50 text-white text-xs px-3 py-1">
                  {progress}%{processing ? " • Processing..." : ""}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 text-sm text-gray-700 flex items-center justify-between">
            <div className="truncate">
              <div className="font-medium">{file.name}</div>
              <div className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>

            <div className="flex items-center ml-3 space-x-2">
              {uploading ? (
                <Button size="sm" variant="ghost" onClick={removeFile} aria-label="Cancel upload">
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={removeFile} aria-label="Remove file">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (value) {
      // already uploaded file (url)
      const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(value);
      return (
        <div className="relative w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-gray-50">
          <div className="w-full h-40 relative bg-gray-100 flex items-center justify-center">
            {isImage ? (
              // If using Next.js Image you can replace <img> with <Image>
              <img src={value} alt="uploaded" className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <FileText className="w-10 h-10 text-gray-400" />
                <span className="text-xs text-gray-600 mt-1">Uploaded file</span>
              </div>
            )}
          </div>

          <div className="p-3 text-sm text-gray-700 flex items-center justify-between">
            <div className="truncate">
              <div className="font-medium break-words">{value}</div>
            </div>
            <div className="flex items-center ml-3 space-x-2">
              <Button size="sm" variant="outline" onClick={() => onUpload("")}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // empty state
    return (
      <div className="text-center text-sm text-gray-600">{placeholder ?? "Drag & drop a file here, or click to select"}</div>
    );
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50/40" : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} name={name} />
        <div className="flex flex-col items-center justify-center gap-3">
          <Upload className="mx-auto h-8 w-8 text-gray-500" />
          {/* preview area */}
          <div className="w-full">{renderPreview()}</div>
        </div>
      </div>

      {/* separate progress bar for systems that prefer it below the image */}
      {(uploading || progress > 0) && (
        <div className="mt-2">
          {/* you may replace with your <Progress /> component */}
          <div className="w-full bg-blue-100 h-2 rounded overflow-hidden">
            <div
              className="h-2 bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-center text-gray-600 mt-1">
            {progress}% • {((file?.size || 0) * (progress / 100) / 1024 / 1024).toFixed(2)} MB uploaded
            {processing && <span className="text-blue-600"> • Processing...</span>}
          </div>
        </div>
      )}
    </div>
  );
}
