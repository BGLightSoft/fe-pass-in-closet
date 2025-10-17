import { CreateWorkspaceForm } from "../components/create-workspace-form";
import { WorkspaceList } from "../components/workspace-list";
import { FolderTree, Info } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3">
            <FolderTree size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-gray-600">
              Organize your credentials into separate workspaces
            </p>
          </div>
        </div>
        <CreateWorkspaceForm />
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={20} />
          <div className="text-sm text-blue-900">
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
