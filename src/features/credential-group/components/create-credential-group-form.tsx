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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateCredentialGroup } from "../hooks/use-create-credential-group";
import {
  type CreateCredentialGroupRequest,
  createCredentialGroupRequestSchema,
} from "../schemas/credential-group-schemas";
import { useCredentialGroupTypes } from "@/features/credential-group-type/hooks/use-credential-group-types";

interface CreateCredentialGroupFormProps {
  parentId?: string | undefined;
  parentName?: string | undefined;
}

export function CreateCredentialGroupForm({
  parentId,
  parentName,
}: CreateCredentialGroupFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createGroup, isPending } = useCreateCredentialGroup();
  const { data: groupTypes, isLoading: isLoadingTypes } =
    useCredentialGroupTypes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateCredentialGroupRequest>({
    resolver: zodResolver(createCredentialGroupRequestSchema),
    defaultValues: {
      name: "",
      credentialGroupTypeName: "",
      credentialGroupId: parentId,
    },
  });

  const onSubmit = (data: CreateCredentialGroupRequest) => {
    createGroup(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {parentId ? (
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <Plus size={14} />
          </Button>
        ) : (
          <Button size="lg" className="gap-2">
            <Plus size={20} />
            Create New Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderPlus className="text-blue-600" size={24} />
            {parentId ? "Create Sub-Group" : "Create Credential Group"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {parentId ? (
              <>
                Create a new group under{" "}
                <span className="font-semibold text-gray-900">
                  {parentName}
                </span>
              </>
            ) : (
              "Organize your credentials by creating a new group"
            )}
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
            <Label htmlFor="type" className="text-base">
              Group Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="credentialGroupTypeName"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select a group type" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTypes ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm">Loading types...</span>
                      </div>
                    ) : groupTypes && groupTypes.length > 0 ? (
                      groupTypes
                        .filter((type) => type.isActive)
                        .map((type) => (
                          <SelectItem key={type.id} value={type.name || ""}>
                            {type.name}
                          </SelectItem>
                        ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No types available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.credentialGroupTypeName && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.credentialGroupTypeName.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              The type determines what fields are available for credentials in
              this group
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
