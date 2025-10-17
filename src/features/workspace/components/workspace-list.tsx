import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Check, Trash2, Edit } from "lucide-react";
import { useDeleteWorkspace } from "../hooks/use-delete-workspace";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useWorkspaceStore } from "../store/workspace-store";
import { useQueryClient } from "@tanstack/react-query";

export function WorkspaceList() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">
            No workspaces found. Create your first workspace!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {workspaces.map((workspace) => {
        const isSelected = currentWorkspace?.id === workspace.id;

        return (
          <Card
            key={workspace.id}
            className={isSelected ? "border-blue-500 ring-2 ring-blue-100" : ""}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{workspace.name}</span>
                  {workspace.isDefault && (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Default
                    </span>
                  )}
                </div>
                {isSelected && <Check size={20} className="text-blue-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <div>Status: {workspace.isActive ? "Active" : "Inactive"}</div>
                <div>
                  Created: {new Date(workspace.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setCurrentWorkspace(workspace);
                    // Invalidate credential-related queries when workspace changes
                    queryClient.invalidateQueries({
                      queryKey: ["credential-groups"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["credentials"],
                    });
                  }}
                  disabled={isSelected}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Open edit modal
                    alert("Edit functionality coming soon!");
                  }}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${workspace.name}"?`
                      )
                    ) {
                      deleteWorkspace(workspace.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
