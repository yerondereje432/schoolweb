"use client";

import { useState, useTransition } from "react";
import { updateAboutContent, type AboutContent } from "@/lib/actions/about";
import { Check } from "lucide-react";

const SECTIONS = [
  { key: "mission", label: "Mission Statement" },
  { key: "vision", label: "Vision Statement" },
  { key: "history", label: "History" },
  { key: "why_distinguished", label: "Why HUSSS Is Distinguished" },
] as const;

const LANGS = [
  { code: "en", label: "English" },
  { code: "om", label: "Afaan Oromo" },
  { code: "am", label: "Amharic" },
] as const;

export default function AboutClient({
  initialData,
}: {
  initialData: Partial<AboutContent> | null;
}) {
  const [data, setData] = useState<Partial<AboutContent>>(initialData || {});
  const [activeLang, setActiveLang] = useState<(typeof LANGS)[number]["code"]>(
    "en"
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const result = await updateAboutContent(data);
      if (!result.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setActiveLang(lang.code)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeLang === lang.code
                ? "bg-white shadow-sm text-husss-green-900 font-medium"
                : "text-gray-500"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const fieldKey = `${section.key}_${activeLang}` as keyof AboutContent;
          return (
            <div key={section.key}>
              <label className="block text-sm font-medium text-husss-green-900 mb-1.5">
                {section.label}
              </label>
              <textarea
                rows={4}
                lang={activeLang === "am" ? "am" : undefined}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={(data[fieldKey] as string) || ""}
                onChange={(e) =>
                  setData({ ...data, [fieldKey]: e.target.value })
                }
                placeholder={
                  activeLang === "en"
                    ? `Write the ${section.label.toLowerCase()}…`
                    : ""
                }
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={isPending}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-husss-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-husss-green-700 disabled:opacity-60"
      >
        {saved ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : isPending ? (
          "Saving…"
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}
