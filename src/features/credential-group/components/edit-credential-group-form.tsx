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
import { useUpdateCredentialGroup } from "../hooks/use-update-credential-group";
import {
  type UpdateCredentialGroupRequest,
  updateCredentialGroupRequestSchema,
} from "../schemas/credential-group-schemas";
import type { CredentialGroup } from "../schemas/credential-group-schemas";

interface EditCredentialGroupFormProps {
  group: CredentialGroup;
}

export function EditCredentialGroupForm({
  group,
}: EditCredentialGroupFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateGroup, isPending } = useUpdateCredentialGroup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateCredentialGroupRequest>({
    resolver: zodResolver(updateCredentialGroupRequestSchema),
    defaultValues: {
      name: group.name || "",
      isActive: group.isActive,
    },
  });

  // Update form values when group changes
  useEffect(() => {
    setValue("name", group.name || "");
    setValue("isActive", group.isActive);
  }, [group.name, group.isActive, setValue]);

  const onSubmit = (data: UpdateCredentialGroupRequest) => {
    updateGroup(
      { id: group.id, data },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    } else {
      // Reset form with current group values when opening
      reset({
        name: group.name || "",
        isActive: group.isActive,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          title="Edit group"
        >
          <Edit size={14} />
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
                Edit Group
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Update details for{" "}
                <span className="font-semibold text-gray-900">
                  "{group.name}"
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Production Servers, Email Accounts"
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
                  Inactive groups are hidden from the list
                </p>
              </div>
              <Switch
                id="isActive"
                checked={group.isActive}
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
                  Update Group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
