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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="text-blue-600" size={24} />
            Edit Credential Group
          </DialogTitle>
          <DialogDescription className="text-base">
            Update the details for{" "}
            <span className="font-semibold text-gray-900">"{group.name}"</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Production Servers, Email Accounts"
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
                Active (uncheck to disable this group)
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
