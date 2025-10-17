import { useAuthStore } from "@/features/auth/store/auth-store";
import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";
import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { User, FolderTree, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currentWorkspace, workspaces } = useWorkspaceStore();

  // Fetch workspaces on dashboard load
  useWorkspaces();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
        <p className="text-gray-600">Here's your overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.email}</div>
            <p className="text-xs text-muted-foreground">
              {user?.isActive ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Workspace
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentWorkspace?.name || "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentWorkspace ? "Selected" : "Please select a workspace"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workspaces
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspaces.length}</div>
            <p className="text-xs text-muted-foreground">
              {workspaces.length === 1 ? "workspace" : "workspaces"} available
            </p>
          </CardContent>
        </Card>
      </div>

      {!currentWorkspace && workspaces.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Please select a workspace from the dropdown in the header to
              access credential groups and credentials.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
