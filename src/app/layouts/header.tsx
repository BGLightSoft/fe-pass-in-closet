import { useAuthStore } from "@/features/auth/store/auth-store";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { WorkspaceSelector } from "./workspace-selector";
import { useGetMyAccount } from "@/features/account/hooks/use-get-my-account";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuthStore();
  const { data: myAccount } = useGetMyAccount();
  const navigate = useNavigate();

  const displayName = myAccount?.accountParameters?.firstName
    ? `${myAccount.accountParameters.firstName} ${
        myAccount.accountParameters.lastName || ""
      }`.trim()
    : user?.email || "User";

  const initials = myAccount?.accountParameters?.firstName
    ? `${myAccount.accountParameters.firstName[0]}${
        myAccount.accountParameters.lastName?.[0] || ""
      }`.toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <WorkspaceSelector />
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 focus:outline-none">
            <span className="text-sm font-medium text-gray-700">
              {displayName}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/account/settings")}
              className="cursor-pointer"
            >
              <Settings size={16} className="mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-red-600"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
