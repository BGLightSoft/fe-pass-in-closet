import { useAuthStore } from "@/features/auth/store/auth-store";
import { LogOut, Settings } from "lucide-react";
import { WorkspaceSelector } from "./workspace-selector";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Pass-in-Closet</h2>
        <WorkspaceSelector />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button
          type="button"
          className="rounded p-2 hover:bg-gray-100"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          type="button"
          className="rounded p-2 hover:bg-gray-100"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
