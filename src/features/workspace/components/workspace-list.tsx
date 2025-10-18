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
  StarOff,
} from "lucide-react";
import { useDeleteWorkspace } from "../hooks/use-delete-workspace";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useSetDefaultWorkspace } from "../hooks/use-set-default-workspace";
import { useWorkspaceStore } from "../store/workspace-store";
import { useQueryClient } from "@tanstack/react-query";
import { EditWorkspaceForm } from "./edit-workspace-form";

export function WorkspaceList() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: setDefaultWorkspace, isPending: isSettingDefault } =
    useSetDefaultWorkspace();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-3 text-sm text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="rounded-full bg-gray-100 p-3">
            <FolderTree size={32} className="text-gray-400" />
          </div>
          <p className="mt-3 text-lg font-medium text-gray-900">
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {workspaces.map((workspace) => {
        const isSelected = currentWorkspace?.id === workspace.id;

        return (
          <Card
            key={workspace.id}
            className={`group relative overflow-hidden transition-all hover:shadow-md ${
              isSelected
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-200"
                : "hover:border-gray-300"
            }`}
          >
            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute right-0 top-0">
                <div className="relative">
                  <div className="absolute -right-6 -top-6 h-12 w-12 rotate-45 bg-blue-500" />
                  <Check
                    size={12}
                    className="absolute right-1.5 top-1.5 text-white"
                  />
                </div>
              </div>
            )}

            <CardContent className="p-4">
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-lg p-2 ${
                      isSelected ? "bg-blue-600" : "bg-blue-100"
                    }`}
                  >
                    <FolderTree
                      size={16}
                      className={isSelected ? "text-white" : "text-blue-600"}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {workspace.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                {workspace.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <Star size={10} className="fill-amber-700" />
                    Default
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    workspace.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {workspace.isActive ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <XCircle size={10} />
                  )}
                  {workspace.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Info */}
              <div className="mb-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs h-7"
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
                      <Check size={12} className="mr-1" />
                      Selected
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
                <Button
                  variant={workspace.isDefault ? "default" : "ghost"}
                  size="sm"
                  className={`h-7 w-7 p-0 ${
                    workspace.isDefault
                      ? "text-amber-600 hover:bg-amber-100"
                      : "text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                  onClick={() => setDefaultWorkspace(workspace.id)}
                  disabled={isSettingDefault || workspace.isDefault}
                  title={
                    workspace.isDefault ? "Default workspace" : "Set as default"
                  }
                >
                  {workspace.isDefault ? (
                    <Star size={14} className="fill-amber-600" />
                  ) : (
                    <StarOff size={14} />
                  )}
                </Button>
                <EditWorkspaceForm workspace={workspace} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                      disabled={isDeleting}
                      title="Delete workspace"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={20} />
                        Delete Workspace?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-900">
                          "{workspace.name}"
                        </span>
                        ?
                        <div className="mt-3 rounded-lg bg-red-50 p-3">
                          <p className="font-medium text-red-900">
                            ⚠️ This will permanently:
                          </p>
                          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-900">
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
