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
import { Edit, Loader2, Key, Eye, EyeOff } from "lucide-react";
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
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});
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
    setValue,
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

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

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
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
              <Key size={24} className="text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Edit Credential
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Update details for{" "}
                <span className="font-semibold text-gray-900">
                  "{credential.name}"
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Credential Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., My Gmail Account"
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

          {/* Parameters */}
          {parameterKeys.length > 0 && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Credential Parameters
                </h3>
                <div className="space-y-4">
                  {parameterKeys.map((key) => {
                    const formattedLabel = toTitleCase(key);
                    const isPasswordField = key
                      .toLowerCase()
                      .includes("password");
                    const isVisible = passwordVisibility[key] || false;

                    return (
                      <div key={key} className="space-y-2">
                        <Label
                          htmlFor={`parameter-${key}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          {formattedLabel}
                        </Label>
                        <div className="relative">
                          <Input
                            id={`parameter-${key}`}
                            type={
                              isPasswordField && !isVisible
                                ? "password"
                                : "text"
                            }
                            placeholder={`Enter ${formattedLabel.toLowerCase()}`}
                            className={`h-11 ${isPasswordField ? "pr-10" : ""}`}
                            {...register(`parameters.${key}` as any)}
                          />
                          {isPasswordField && (
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(key)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {isVisible ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          )}
                        </div>
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
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Status
                </Label>
                <p className="text-xs text-gray-500">
                  Inactive credentials are hidden from the list
                </p>
              </div>
              <Switch
                id="isActive"
                checked={credential.isActive}
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
