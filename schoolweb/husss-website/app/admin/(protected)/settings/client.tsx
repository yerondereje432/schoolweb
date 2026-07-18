"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings, type SiteSettings } from "@/lib/actions/settings";
import ImageUploader from "@/components/admin/image-uploader";
import { Check } from "lucide-react";

export default function SettingsClient({
  initialData,
}: {
  initialData: Partial<SiteSettings> | null;
}) {
  const [data, setData] = useState<Partial<SiteSettings>>(initialData || {});
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const result = await updateSiteSettings(data);
      if (!result.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          Logo
        </h2>
        <ImageUploader
          folder="branding"
          value={data.logo_url}
          onChange={(url) => setData({ ...data, logo_url: url })}
          aspect="aspect-square"
          label="Site logo"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          School Name
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              Full name (English)
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={data.school_name_en || ""}
              onChange={(e) =>
                setData({ ...data, school_name_en: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              Full name (Afaan Oromo)
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={data.school_name_om || ""}
              onChange={(e) =>
                setData({ ...data, school_name_om: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              Full name (Amharic)
            </label>
            <input
              lang="am"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={data.school_name_am || ""}
              onChange={(e) =>
                setData({ ...data, school_name_am: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              Short name / acronym
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={data.short_name || ""}
              onChange={(e) =>
                setData({ ...data, short_name: e.target.value })
              }
              placeholder="HUSSS"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          Footer Text (English)
        </h2>
        <textarea
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={data.footer_text_en || ""}
          onChange={(e) => setData({ ...data, footer_text_en: e.target.value })}
          placeholder="e.g. © 2026 HUSSS. All rights reserved."
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          Brand Colors
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          Pre-filled from the HUSSS logo. Change only if the school updates
          its visual identity.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ["primary_color", "Primary (green)"],
              ["secondary_color", "Secondary (gold)"],
              ["accent_color", "Accent"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-husss-green-900 mb-1">
                {label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded border border-gray-300"
                  value={data[key] || "#1E7B34"}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                />
                <input
                  className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-xs font-mono"
                  value={data[key] || ""}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-husss-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-husss-green-700 disabled:opacity-60"
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
