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
  Star,
  StarOff,
  Pencil,
} from "lucide-react";
import { Switch } from "@/shared/ui/switch";
import { useDeleteWorkspace } from "../hooks/use-delete-workspace";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useSetDefaultWorkspace } from "../hooks/use-set-default-workspace";
import { useUpdateWorkspace } from "../hooks/use-update-workspace";
import { useWorkspaceStore } from "../store/workspace-store";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/shared/ui/input";

export function WorkspaceList() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: setDefaultWorkspace, isPending: isSettingDefault } =
    useSetDefaultWorkspace();
  const { mutate: updateWorkspace } = useUpdateWorkspace();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleNameEdit = (workspaceId: string, currentName: string) => {
    setEditingId(workspaceId);
    setEditingName(currentName || "");
  };

  const handleNameSave = (workspace: any) => {
    if (editingName.trim() && editingName !== workspace.name) {
      updateWorkspace(
        {
          id: workspace.id,
          data: {
            name: editingName.trim(),
            isActive: workspace.isActive,
          },
        },
        {
          onSuccess: () => {
            setEditingId(null);
          },
        }
      );
    } else {
      setEditingId(null);
    }
  };

  const handleToggleActive = (workspace: any) => {
    updateWorkspace({
      id: workspace.id,
      data: {
        name: workspace.name || "",
        isActive: !workspace.isActive,
      },
    });
  };

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
      <Card className="border-dashed border-gray-300">
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
        const isEditing = editingId === workspace.id;

        return (
          <Card
            key={workspace.id}
            className={`group relative overflow-hidden transition-all duration-200 ${
              isSelected
                ? "border-blue-400 bg-gradient-to-br from-blue-50 via-blue-50/50 to-white ring-2 ring-blue-300 shadow-lg"
                : "border-gray-300 hover:border-blue-300 hover:shadow-md"
            }`}
          >
            <CardContent className="p-4">
              {/* Header with Icon and Name */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`rounded-lg p-2.5 transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 shadow-lg shadow-blue-200"
                        : "bg-blue-100 group-hover:bg-blue-200"
                    }`}
                  >
                    <FolderTree
                      size={18}
                      className={isSelected ? "text-white" : "text-blue-600"}
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <Switch
                      checked={workspace.isActive}
                      onCheckedChange={() => handleToggleActive(workspace)}
                      className={`scale-75 ${
                        workspace.isActive
                          ? "data-[state=checked]:bg-green-500"
                          : ""
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        workspace.isActive ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {workspace.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex items-center">
                  {isEditing ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleNameSave(workspace)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNameSave(workspace);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="h-10 text-base font-semibold"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">
                        {workspace.name}
                      </h3>
                      <button
                        onClick={() =>
                          handleNameEdit(workspace.id, workspace.name || "")
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded"
                        title="Edit name"
                      >
                        <Pencil size={14} className="text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {/* Select Button */}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 text-xs h-8 transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                      : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 cursor-pointer hover:scale-105"
                  }`}
                  onClick={() => {
                    setCurrentWorkspace(workspace);
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

                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 transition-all duration-200 ${
                    workspace.isDefault
                      ? "bg-amber-100 text-amber-600 hover:bg-amber-200 shadow-md"
                      : "text-gray-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110"
                  }`}
                  onClick={() => setDefaultWorkspace(workspace.id)}
                  disabled={isSettingDefault || workspace.isDefault}
                  title={
                    workspace.isDefault ? "Default workspace" : "Set as default"
                  }
                >
                  {workspace.isDefault ? (
                    <Star size={16} className="fill-amber-600" />
                  ) : (
                    <StarOff size={16} />
                  )}
                </Button>

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:scale-110"
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
