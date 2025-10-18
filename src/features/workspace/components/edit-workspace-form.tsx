import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, FolderEdit } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateWorkspace } from "../hooks/use-update-workspace";
import {
  type UpdateWorkspaceRequest,
  updateWorkspaceRequestSchema,
  type Workspace,
} from "../schemas/workspace-schemas";

interface EditWorkspaceFormProps {
  workspace: Workspace;
}

export function EditWorkspaceForm({ workspace }: EditWorkspaceFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateWorkspaceRequest>({
    resolver: zodResolver(updateWorkspaceRequestSchema),
  });

  // Update form values when dialog opens or workspace changes
  useEffect(() => {
    if (open) {
      reset({
        name: workspace.name || "",
        isActive: workspace.isActive,
      });
    }
  }, [open, workspace.name, workspace.isActive, reset]);

  const onSubmit = (data: UpdateWorkspaceRequest) => {
    updateWorkspace(
      { id: workspace.id, data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          title="Edit workspace"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
              <FolderEdit size={24} className="text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Edit Workspace
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Update details for{" "}
                <span className="font-semibold text-gray-900">
                  "{workspace.name}"
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., My Company, Personal"
              className="h-11"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Status
                </Label>
                <p className="text-xs text-gray-500">
                  Inactive workspaces are hidden from the list
                </p>
              </div>
              <Switch
                id="isActive"
                checked={workspace.isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            {errors.isActive && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.isActive.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit size={16} />
                  Update Workspace
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
