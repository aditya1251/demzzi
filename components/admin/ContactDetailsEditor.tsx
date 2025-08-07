"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
    setMessage(null);
    try {
      const res = await fetch("/api/admin/contact-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Contact details updated successfully!' });
        toast.success("Contact details updated!");
      } else {
        setMessage({ type: 'error', text: 'Failed to update contact details. Please try again.' });
        toast.error("Failed to update contact details.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading contact details...</p>;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Contact Details</h2>

        {message && (
          <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={details.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="Enter WhatsApp number"
              value={details.WhatsApp || ""}
              onChange={(e) => handleChange("WhatsApp", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={details.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full mt-6">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}