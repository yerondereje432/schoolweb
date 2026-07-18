"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImageAction } from "@/lib/actions/upload";
import { ImagePlus, Loader2, X } from "lucide-react";

export default function ImageUploader({
  folder,
  value,
  onChange,
  label = "Image",
  aspect = "aspect-video",
}: {
  folder: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    });
  }

  return (
    <div>
      <label className="block text-sm font-medium text-husss-green-900 mb-1.5">
        {label}
      </label>

      <div
        className={`relative ${aspect} w-full max-w-xs rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer hover:border-husss-green-400 transition-colors`}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400 px-4">
            <ImagePlus className="mx-auto mb-1.5" size={22} />
            <p className="text-xs">Click to upload</p>
          </div>
        )}

        {pending && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="animate-spin text-husss-green-600" size={22} />
          </div>
        )}

        {value && !pending && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
