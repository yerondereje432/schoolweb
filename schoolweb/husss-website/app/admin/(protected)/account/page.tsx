import { requireAdmin } from "@/lib/auth";
import ChangePasswordForm from "./client";

export default async function AccountPage() {
  const admin = await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        My Account
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Signed in as <strong>{admin.email}</strong> ({admin.role.replace("_", " ")})
      </p>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-md">
        <h2 className="text-sm font-semibold text-husss-green-900 mb-4">
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
