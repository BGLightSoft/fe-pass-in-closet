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
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="text-blue-600" size={24} />
            Edit Workspace
          </DialogTitle>
          <DialogDescription className="text-base">
            Update the details for{" "}
            <span className="font-semibold text-gray-900">
              "{workspace.name}"
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., My Company, Personal"
              className="h-11 text-base"
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
            <Label htmlFor="isActive" className="text-base">
              Status
            </Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...register("isActive")}
              />
              <Label htmlFor="isActive" className="text-sm">
                Active (uncheck to disable this workspace)
              </Label>
            </div>
            {errors.isActive && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.isActive.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
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
