"use client";

import { useState, useTransition } from "react";
import { markSubmissionRead, deleteSubmission } from "@/lib/actions/contact";
import { Trash2, Mail, MailOpen } from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function SubmissionsClient({
  initialData,
}: {
  initialData: Submission[];
}) {
  const [items, setItems] = useState(initialData);
  const [, startTransition] = useTransition();

  function toggleRead(item: Submission) {
    startTransition(async () => {
      await markSubmissionRead(item.id, !item.is_read);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_read: !i.is_read } : i
        )
      );
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    startTransition(async () => {
      await deleteSubmission(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No messages yet. They&apos;ll appear here as parents/students submit
        the contact form.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded-xl border p-4 ${
            item.is_read ? "border-gray-100" : "border-husss-green-300"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-husss-green-950">
                  {item.name}
                </p>
                {!item.is_read && (
                  <span className="w-2 h-2 rounded-full bg-husss-gold-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {item.email}
                {item.phone ? ` · ${item.phone}` : ""} ·{" "}
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              {item.subject && (
                <p className="text-sm font-medium text-husss-green-800 mt-2">
                  {item.subject}
                </p>
              )}
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {item.message}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => toggleRead(item)}
                className="p-2 text-gray-400 hover:text-husss-green-600"
                title={item.is_read ? "Mark unread" : "Mark read"}
              >
                {item.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
              </button>
              <button
                onClick={() => remove(item.id)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
