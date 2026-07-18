import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { ShieldAlert } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  insert: "text-husss-green-700 bg-husss-green-50",
  update: "text-husss-gold-700 bg-husss-gold-100",
  delete: "text-red-700 bg-red-50",
};

export default async function AuditLogPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Audit Log
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        A permanent, tamper-resistant record of every content change made by
        an admin — who did what, and when. This cannot be edited or deleted
        by anyone, including super admins, which is what makes it trustworthy
        as a record.
      </p>

      {(!entries || entries.length === 0) && (
        <p className="text-sm text-gray-400 italic">No activity recorded yet.</p>
      )}

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {(entries || []).map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <ShieldAlert size={15} className="text-gray-300 shrink-0" />
            <span
              className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                ACTION_COLORS[entry.action] || "text-gray-600 bg-gray-100"
              }`}
            >
              {entry.action}
            </span>
            <span className="text-gray-700 font-medium">{entry.table_name}</span>
            <span className="text-gray-400">by</span>
            <span className="text-gray-700">{entry.admin_email}</span>
            <span className="text-gray-400 ml-auto text-xs">
              {new Date(entry.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
