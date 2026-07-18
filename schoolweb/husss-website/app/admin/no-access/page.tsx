import { logoutAction } from "@/lib/actions/auth";

export default function NoAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-husss-green-50 px-4">
      <div className="max-w-md text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-lg font-semibold text-husss-green-900 mb-2">
          No admin access yet
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Your account is signed in but hasn&apos;t been granted access to the
          HUSSS admin dashboard. Ask a super admin to add you from{" "}
          <span className="font-medium">Admin → Users</span>.
        </p>
        <form action={logoutAction}>
          <button className="text-sm text-husss-green-700 underline">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
