"use client";

import { useState, useTransition } from "react";
import { updateContactInfo, type ContactInfo } from "@/lib/actions/contact";
import { Check } from "lucide-react";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number | null | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-husss-green-900 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ContactClient({
  initialData,
}: {
  initialData: Partial<ContactInfo> | null;
}) {
  const [data, setData] = useState<Partial<ContactInfo>>(initialData || {});
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const result = await updateContactInfo(data);
      if (!result.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          Basics
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              Address (English)
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={data.address_en || ""}
              onChange={(e) => setData({ ...data, address_en: e.target.value })}
              placeholder="e.g. Haramaya University Compound, Haramaya, Ethiopia"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Primary phone"
              value={data.phone_primary}
              onChange={(v) => setData({ ...data, phone_primary: v })}
              placeholder="+251 ..."
            />
            <Field
              label="Secondary phone"
              value={data.phone_secondary}
              onChange={(v) => setData({ ...data, phone_secondary: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Primary email"
              value={data.email_primary}
              onChange={(v) => setData({ ...data, email_primary: v })}
              placeholder="info@husss.edu.et"
            />
            <Field
              label="Secondary email"
              value={data.email_secondary}
              onChange={(v) => setData({ ...data, email_secondary: v })}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          Map Location
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Latitude"
            type="number"
            value={data.map_lat}
            onChange={(v) => setData({ ...data, map_lat: Number(v) })}
            placeholder="9.4128"
          />
          <Field
            label="Longitude"
            type="number"
            value={data.map_lng}
            onChange={(v) => setData({ ...data, map_lng: Number(v) })}
            placeholder="42.0322"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Tip: find these by right-clicking your school&apos;s location on
          Google Maps.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
          Social Links
        </h2>
        <div className="space-y-3">
          <Field
            label="Facebook URL"
            value={data.facebook_url}
            onChange={(v) => setData({ ...data, facebook_url: v })}
          />
          <Field
            label="Telegram URL"
            value={data.telegram_url}
            onChange={(v) => setData({ ...data, telegram_url: v })}
          />
          <Field
            label="YouTube URL"
            value={data.youtube_url}
            onChange={(v) => setData({ ...data, youtube_url: v })}
          />
          <Field
            label="TikTok URL"
            value={data.tiktok_url}
            onChange={(v) => setData({ ...data, tiktok_url: v })}
          />
          <Field
            label="X (Twitter) URL"
            value={data.x_url}
            onChange={(v) => setData({ ...data, x_url: v })}
          />
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
