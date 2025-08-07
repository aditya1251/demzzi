"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContactDetails {
  phone?: string;
  WhatsApp?: string;
  email?: string;
}

export default function ContactDetailsEditor() {
  const [details, setDetails] = useState<ContactDetails>({
    phone: "",
    WhatsApp: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/contact-details")
      .then((res) => res.json())
      .then((data) => {
        setDetails(data || {});
        setLoading(false);
      });
  }, []);

  const handleChange = (field: keyof ContactDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      if (res.ok) {
        toast.success("Contact details updated!");
      } else {
        toast.error("Failed to update contact details.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading contact details...</p>;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Contact Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Phone"
            value={details.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            type="text"
            placeholder="WhatsApp"
            value={details.WhatsApp || ""}
            onChange={(e) => handleChange("WhatsApp", e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={details.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}