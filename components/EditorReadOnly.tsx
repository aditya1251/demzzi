// components/EditorReadOnly.tsx
"use client";

import React from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

export default function EditorReadOnly({ content }: { content: JSONContent }) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [StarterKit, Underline],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: { class: "prose max-w-none" },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
