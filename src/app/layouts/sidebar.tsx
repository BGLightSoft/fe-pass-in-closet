import { cn } from "@/shared/lib/utils";
import { FolderTree, Key, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workspaces", href: "/workspaces", icon: FolderTree },
  { name: "Credentials", href: "/credential-groups", icon: Key },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white z-10">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <img
          src="/pass-in-closet.png"
          alt="Pass-in-Closet"
          className="h-14 w-auto"
        />
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors border",
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-gray-300 hover:border-blue-200"
              )
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
