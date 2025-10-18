import { WorkspaceList } from "../components/workspace-list";
import { FolderTree, Info } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

export default function WorkspacesPage() {
  return (
    <div className="space-y-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <FolderTree size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Workspaces</h1>
              <p className="text-sm text-blue-100">
                Organize your credentials into separate workspaces
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-blue-300 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-3">
          <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={16} />
          <div className="text-xs text-blue-900">
            <p className="font-medium">What are workspaces?</p>
            <p className="mt-1 text-blue-700">
              Workspaces allow you to separate your credentials by project,
              team, or client. Each workspace can have its own credential groups
              and access settings.
            </p>
          </div>
        </CardContent>
      </Card>

      <WorkspaceList />
    </div>
  );
}
