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
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useUpdateCredential } from "../hooks/use-update-credential";
import {
  type UpdateCredentialRequest,
  updateCredentialRequestSchema,
  type Credential,
} from "../schemas/credential-schemas";
import { toTitleCase } from "@/shared/lib/format-utils";

interface EditCredentialFormProps {
  credential: Credential;
}

export function EditCredentialForm({ credential }: EditCredentialFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateCredential, isPending } = useUpdateCredential();

  // Extract parameter keys and values, excluding system fields
  const parameters = credential.parameters || {};

  // Memoize filtered parameters to prevent infinite loop
  const filteredParameters = useMemo(() => {
    return Object.fromEntries(
      Object.entries(parameters).filter(
        ([key]) =>
          !["isActive", "createdAt", "updatedAt", "index"].includes(key)
      )
    ) as Record<string, string>;
  }, [parameters]);

  const parameterKeys = useMemo(() => {
    return Object.keys(filteredParameters);
  }, [filteredParameters]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCredentialRequest>({
    resolver: zodResolver(updateCredentialRequestSchema),
  });

  // Update form values when dialog opens or credential changes
  useEffect(() => {
    if (open) {
      reset({
        name: credential.name || "",
        isActive: credential.isActive,
        parameters: filteredParameters,
      });
    }
  }, [open, credential.name, credential.isActive, filteredParameters, reset]);

  const onSubmit = (data: UpdateCredentialRequest) => {
    updateCredential(
      { id: credential.id, data },
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
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          title="Edit credential"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="text-blue-600" size={24} />
            Edit Credential
          </DialogTitle>
          <DialogDescription className="text-base">
            Update the details for{" "}
            <span className="font-semibold text-gray-900">
              "{credential.name}"
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Credential Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., My Gmail Account"
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

          {/* Parameters */}
          {parameterKeys.length > 0 && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="mb-4 text-base font-semibold text-gray-900">
                  Parameters
                </h3>
                <div className="space-y-4">
                  {parameterKeys.map((key) => {
                    const formattedLabel = toTitleCase(key);
                    return (
                      <div key={key} className="space-y-2">
                        <Label
                          htmlFor={`parameter-${key}`}
                          className="text-base"
                        >
                          {formattedLabel}
                        </Label>
                        <Input
                          id={`parameter-${key}`}
                          placeholder={`Enter ${formattedLabel.toLowerCase()}`}
                          className="h-11 text-base"
                          {...register(`parameters.${key}` as any)}
                        />
                        {errors.parameters?.[key] && (
                          <p className="flex items-center gap-1 text-sm text-red-600">
                            <span>⚠️</span>{" "}
                            {errors.parameters[key]?.message as string}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
                Active (uncheck to disable this credential)
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
                  Update Credential
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
