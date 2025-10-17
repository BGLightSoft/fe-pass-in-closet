import { CreateWorkspaceForm } from "../components/create-workspace-form";
import { WorkspaceList } from "../components/workspace-list";
import { FolderTree } from "lucide-react";

export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderTree size={32} className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-gray-600">
            Manage your workspaces and organize your credentials
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WorkspaceList />
        </div>
        <div>
          <CreateWorkspaceForm />
        </div>
      </div>
    </div>
  );
}
