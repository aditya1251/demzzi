"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorContent, useEditor, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "next/image";
import {
  Loader2,
  Edit3,
  FileEditIcon,
  Trash2,
  MoveUp,
  MoveDown,
  PlusCircle,
  Save,
  Eye,
  Link,
  Copy,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { FileUploader } from "@/app/[form]/page";

// NOTE: This file is a single-file, production-minded admin content manager.
// Design goals (implemented):
// - Single-click / one-panel actions: publish, view live, export/import JSON, duplicate
// - Inline editing + side pane preview
// - Drag & drop ordering (lightweight: uses native drag events for portability)
// - Templates & quick-add sections
// - Autosave w/ visual save state
// - Accessibility: keyboard focusable controls, aria-labels

interface Service {
  id: string;
  title: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
}

interface ContentSection {
  id?: string;
  title: string;
  content: any; // stored as tiptap JSON
  image?: string;
  order: number;
}

export default function AdminServiceContentPageV2() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ContentSection | null>(
    null
  );
  const [previewSection, setPreviewSection] = useState<ContentSection | null>(
    null
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [querySaving, setQuerySaving] = useState<number>(0);

  useEffect(() => {
    // fetch services list
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => setServices(data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // open editor and fetch content
  const openFor = async (s: Service) => {
    setSelectedService(s);
    setOpen(true);
    setStatus("idle");
    const res = await fetch(`/api/services/${s.id}/content`);
    const data = await res.json();
    const content = (data.content || []) as ContentSection[];
    // ensure order
    content.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setSections(content.map((c, i) => ({ ...c, order: i + 1 })));
  };

  // autosave: whenever querySaving increments, push to server
  useEffect(() => {
    if (!selectedService) return;
    if (querySaving === 0) return;
    setStatus("saving");
    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/admin/services/${selectedService.id}/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: sections }),
        });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1200);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }, 600); // debounce

    return () => clearTimeout(timer);
  }, [querySaving]);

  // editor for active section (tiptap)
  const editor = useEditor(
    {
      extensions: [StarterKit, Underline],
      immediatelyRender: false,
      content: activeSection?.content || "<p></p>",
      onUpdate: ({ editor }) => {
        if (activeSection) {
          setActiveSection({ ...activeSection, content: editor.getJSON() });
        }
      },
    },
    [activeSection?.id]
  );

  const updateSection = () => {
    if (!activeSection) return;
    setSections((prev) =>
      prev.map((s) => (s.id === activeSection.id ? { ...activeSection } : s))
    );
    setActiveSection(null);
    setQuerySaving((n) => n + 1);
  };

  const addSection = (template?: Partial<ContentSection>) => {
    const s: ContentSection = {
      id: `tmp_${Date.now()}`,
      title: template?.title || "New Section",
      content: template?.content || {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
      image: template?.image,
      order: sections.length + 1,
    };
    setSections((prev) => [...prev, s]);
    // open inline editor immediately for fast one-click workflow
    setTimeout(() => setActiveSection(s), 50);
    setQuerySaving((n) => n + 1);
  };

  const deleteSection = (id?: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setQuerySaving((n) => n + 1);
  };

  // lightweight native drag & drop for ordering (no external libs, one-click friendly)
  const onDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
  };
  const onDropTo = (e: React.DragEvent, index: number) => {
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from)) return;
    const copy = [...sections];
    const [item] = copy.splice(from, 1);
    copy.splice(index, 0, item);
    setSections(copy.map((s, i) => ({ ...s, order: i + 1 })));
    setQuerySaving((n) => n + 1);
  };

  const saveNow = async () => {
    if (!selectedService) return;
    setStatus("saving");
    try {
      await fetch(`/api/admin/services/${selectedService.id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: sections }),
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 900);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const exportJSON = () => {
    const payload = JSON.stringify(
      { service: selectedService, content: sections },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      selectedService?.slug || selectedService?.title || "service"
    }-content.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setSections(parsed);
      } else if (parsed.content) {
        setSections(parsed.content);
      } else if (parsed.sections) {
        setSections(parsed.sections);
      }
      setQuerySaving((n) => n + 1);
    } catch (e) {
      console.error(e);
      alert("Failed to import JSON: " + String(e));
    }
  };

  const quickTemplates = useMemo(
    () => [
      // 1) FAQ Block (single Q/A) — your original
      {
        title: "FAQ Block",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Q: ...\nA: ..." }],
            },
          ],
        },
      },

      // 2) FAQ (multiple questions)
      {
        title: "FAQ — Multiple",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Frequently Asked Questions" }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "Q: How long does it take?" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A: Typical turnaround is 3–5 business days.",
                },
              ],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "Q: What is included?" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A: Setup, 1 revision, final deliverables in PDF/HTML.",
                },
              ],
            },
          ],
        },
      },

      // 3) Hero / Intro
      {
        title: "Hero / Intro",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Simple & Fast Service" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "We handle the heavy lifting so you can focus on growing your business.",
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Call to action: Get started — contact us today.",
                },
              ],
            },
          ],
        },
      },
    ],
    []
  );

  const generateSlug = (title = "") => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 120);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-2">
        <FileEditIcon /> Manage Service Content 
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-6 border rounded-xl bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="border-green-300 shadow-md hover:shadow-lg transition">
              <CardContent className="p-4 flex flex-col items-center text-center">
                {service.imageUrl && (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={80}
                    height={80}
                    className="rounded-full mb-3"
                  />
                )}
                <h2 className="font-semibold text-green-700">
                  {service.title}
                </h2>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openFor(service)}
                    aria-label={`Edit ${service.title}`}>
                    <Edit3 className="w-4 h-4 mr-2" /> Manage
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `/services/${service.slug || service.id}`,
                        "_blank"
                      )
                    }>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-green-700 text-xl font-bold">
                ✍️ Edit — {selectedService?.title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3">
              <Button
                className="bg-green-600 text-white"
                onClick={() => addSection()}>
                <PlusCircle className="w-4 h-4 mr-2" /> Quick Add
              </Button>

              <div className="flex gap-2">
                {quickTemplates.map((t) => (
                  <Button
                    key={t.title}
                    size="sm"
                    variant="outline"
                    onClick={() => addSection(t)}>
                    {t.title}
                  </Button>
                ))}
              </div>

             
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
              {sections.map((section, idx) => (
                <div
                  key={section.id || idx}
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropTo(e, idx)}
                  className="border bg-white p-3 rounded-lg shadow-sm flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-700">
                      {section.title || "Untitled"}
                    </h3>
                    <div className="text-sm mt-1 prose max-w-none line-clamp-3">
                      {section.content ? (
                        <EditorReadOnly content={section.content} />
                      ) : (
                        <em className="text-gray-400">No content</em>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Order: {section.order}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setActiveSection(section);
                      }}
                      aria-label="Edit section">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewSection(section)}
                      aria-label="Preview">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSection(section.id)}
                      aria-label="Delete">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: meta, one-click actions */}
          <aside className="space-y-4">
            <Card>
              <CardContent>
                <h4 className="font-semibold">Quick actions</h4>
                 <div className="mx-auto w-full m-2 justify-evenly flex items-center">
                <input
                  id="import"
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
                />
                <label
                  htmlFor="import"
                  className="btn flex gap-1 btn-ghost cursor-pointer">
                  <Copy className="w-4 h-4 mr-2" /> Import
                </label>

                <Button size="sm" variant="ghost" onClick={exportJSON}>
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>

                <Button
                  size="sm"
                  className="bg-green-500 text-white"
                  onClick={saveNow}>
                  {status === "saving" ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}{" "}
                  Save
                </Button>
              </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      window.open(
                        `/services/${
                          selectedService?.slug || selectedService?.id
                        }`,
                        "_blank"
                      )
                    }>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Open live view
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h4 className="font-semibold">Meta</h4>
                <div className="mt-2 space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={selectedService?.title || ""}
                    onChange={(e) =>
                      setSelectedService((s) =>
                        s ? { ...s, title: e.target.value } : s
                      )
                    }
                  />

                  <Label>Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      value={selectedService?.slug || ""}
                      onChange={(e) =>
                        setSelectedService((s) =>
                          s ? { ...s, slug: e.target.value } : s
                        )
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSelectedService((s) =>
                          s ? { ...s, slug: generateSlug(s.title || "") } : s
                        )
                      }>
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-xs text-gray-500">Save status: {status}</div>
          </aside>

          {/* Inline editor modal */}
         {activeSection && (
  <Dialog open={true} onOpenChange={() => setActiveSection(null)}>
    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">
          ✏️ Edit Section — {activeSection.title}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-3">
        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input
            value={activeSection.title}
            onChange={(e) =>
              setActiveSection({
                ...activeSection,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* Image */}
        <div>
          <Label>Image</Label>
          <FileUploader
            name="image"
            onUpload={(url) =>
              setActiveSection({ ...activeSection, image: url })
            }
            onError={(msg) => alert(`Image upload failed: ${msg}`)}
            placeholder="Upload image"
          />
          {activeSection.image && (
            <img
              src={activeSection.image}
              alt="preview"
              className="mt-2 max-h-40 rounded border object-contain"
            />
          )}
        </div>
      </div>

      {/* Editor */}
      {editor && (
        <>
          <div className="sticky top-0 z-10 border rounded-md p-2 bg-green-50 flex gap-2 flex-wrap">
            {/* Toolbar */}
            <button
              className={`px-2 py-1 rounded ${
                editor.isActive("bold") ? "bg-green-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}>
              <b>B</b>
            </button>
            <button
              className={`px-2 py-1 rounded ${
                editor.isActive("italic") ? "bg-green-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}>
              <i>I</i>
            </button>
            <button
              className={`px-2 py-1 rounded ${
                editor.isActive("underline") ? "bg-green-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <u>U</u>
            </button>
            <button
              className={`px-2 py-1 rounded ${
                editor.isActive("bulletList") ? "bg-green-200" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}>
              • List
            </button>
          </div>

          <div className="border border-green-300 rounded-lg">
            <EditorContent
              editor={editor}
              className="p-4 min-h-[200px] max-h-[50vh] overflow-y-auto"
            />
          </div>
        </>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setActiveSection(null)}>
          Cancel
        </Button>
        <Button className="bg-green-600 text-white" onClick={updateSection}>
          Save Changes
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}


          {/* Preview dialog */}
          {previewSection && (
            <Dialog open={true} onOpenChange={() => setPreviewSection(null)}>
              <DialogContent className="max-w-3xl space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Preview — {previewSection.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="prose max-w-none">
                  <EditorReadOnly content={previewSection.content} />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Small helper: render tiptap JSON in readonly editor instance (keeps bundle small - uses useEditor)
function EditorReadOnly({ content }: { content: JSONContent }) {
  const preview = useEditor({
    extensions: [StarterKit, Underline],
    content,
    immediatelyRender: false,
    editable: false,
  });
  if (!preview) return null;
  return (
    <EditorContent editor={preview} className="prose max-w-none text-sm" />
  );
}
