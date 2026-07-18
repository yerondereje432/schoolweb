"use client";

import { Phone, Mail } from "lucide-react";
import MagneticButton from "@/components/public/animations/MagneticButton";

export default function ContactQuickActions({
  phone,
  email,
}: {
  phone?: string | null;
  email?: string | null;
}) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <MagneticButton
        variant="outline"
        size="md"
        className="w-full"
        onClick={() => window.open("tel:" + (phone || ""), "_self")}
      >
        <Phone size={18} /> Call Now
      </MagneticButton>
      <MagneticButton
        variant="primary"
        size="md"
        className="w-full"
        onClick={() => window.open("mailto:" + (email || ""), "_self")}
      >
        <Mail size={18} /> Email Us
      </MagneticButton>
    </div>
  );
}
