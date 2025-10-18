import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import {
  Check,
  Trash2,
  AlertTriangle,
  FolderTree,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";
import { useDeleteWorkspace } from "../hooks/use-delete-workspace";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useWorkspaceStore } from "../store/workspace-store";
import { useQueryClient } from "@tanstack/react-query";
import { EditWorkspaceForm } from "./edit-workspace-form";

export function WorkspaceList() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="rounded-full bg-gray-100 p-4">
            <FolderTree size={48} className="text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-900">
            No workspaces yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Create your first workspace to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {workspaces.map((workspace) => {
        const isSelected = currentWorkspace?.id === workspace.id;

        return (
          <Card
            key={workspace.id}
            className={`group relative overflow-hidden transition-all hover:shadow-lg ${
              isSelected
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-200"
                : "hover:border-gray-300"
            }`}
          >
            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute right-0 top-0">
                <div className="relative">
                  <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-blue-500" />
                  <Check
                    size={16}
                    className="absolute right-2 top-2 text-white"
                  />
                </div>
              </div>
            )}

            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2.5 ${
                      isSelected ? "bg-blue-600" : "bg-blue-100"
                    }`}
                  >
                    <FolderTree
                      size={20}
                      className={isSelected ? "text-white" : "text-blue-600"}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {workspace.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {workspace.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    <Star size={12} className="fill-amber-700" />
                    Default
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    workspace.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {workspace.isActive ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {workspace.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Info */}
              <div className="mb-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
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
                  {isSelected ? (
                    <>
                      <Check size={14} className="mr-1" />
                      Selected
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
                <EditWorkspaceForm workspace={workspace} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                      disabled={isDeleting}
                      title="Delete workspace"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={24} />
                        Delete Workspace?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-900">
                          "{workspace.name}"
                        </span>
                        ?
                        <div className="mt-3 rounded-lg bg-red-50 p-3">
                          <p className="font-medium text-red-900">
                            ⚠️ This will permanently:
                          </p>
                          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-900">
                            <li>Delete all credential groups</li>
                            <li>Remove all credentials and their data</li>
                            <li>This action cannot be undone!</li>
                          </ul>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteWorkspace(workspace.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Workspace
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
