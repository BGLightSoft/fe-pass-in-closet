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
import { Loader2, Plus, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCredentialRequestSchema } from "../schemas/credential-schemas";
import { useCreateCredential } from "../hooks/use-create-credential";
import { useCredentialParameterList } from "../hooks/use-credential-parameter-list";
import { toTitleCase } from "@/shared/lib/format-utils";

interface CreateCredentialFormProps {
  credentialGroupId: string;
  credentialGroupTypeId: string;
  credentialGroupName?: string;
}

export function CreateCredentialForm({
  credentialGroupId,
  credentialGroupTypeId,
  credentialGroupName,
}: CreateCredentialFormProps) {
  const [open, setOpen] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});
  const createCredential = useCreateCredential();

  const { data: parameterList, isLoading: isLoadingParameters } =
    useCredentialParameterList(credentialGroupTypeId);

  // Dynamic form schema based on parameter list (excluding 'index')
  const formSchema = z.object({
    name: z.string().min(1, "Credential name is required").max(255),
    ...Object.fromEntries(
      (parameterList || [])
        .filter((param) => param.name !== "index") // Filter out index parameter
        .map((param) => [
          param.name!,
          z.string().min(1, `${param.name} is required`),
        ])
    ),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const onSubmit = (data: FormData) => {
    const { name, ...parameters } = data;

    const requestData = {
      credentialGroupId,
      name,
      parameters,
    };

    createCredential.mutate(requestData, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
      setPasswordVisibility({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={14} />
          <span className="text-xs font-medium">New Credential</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
              <Key size={24} className="text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Create New Credential
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Add to{" "}
                <span className="font-semibold text-gray-900">
                  {credentialGroupName || "this group"}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoadingParameters ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2
                className="mx-auto animate-spin text-blue-600"
                size={40}
              />
              <p className="mt-3 text-sm text-gray-600">Loading fields...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
            {/* Credential Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Credential Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Production Database, Admin Email"
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

            {/* Dynamic Parameter Inputs (excluding 'index') */}
            {parameterList
              ?.filter((param) => param.name !== "index") // Don't show index input
              .map((param) => {
                const formattedLabel = toTitleCase(param.name!);
                const isPasswordField = param.name
                  ?.toLowerCase()
                  .includes("password");
                const isVisible = passwordVisibility[param.name!] || false;

                return (
                  <div key={param.id} className="space-y-2">
                    <Label
                      htmlFor={param.name!}
                      className="text-sm font-medium text-gray-700"
                    >
                      {formattedLabel} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={param.name!}
                        type={
                          isPasswordField && !isVisible ? "password" : "text"
                        }
                        placeholder={
                          (param.data as { placeholder?: string })
                            ?.placeholder ||
                          `Enter ${formattedLabel.toLowerCase()}`
                        }
                        {...register(param.name! as keyof FormData)}
                        className={`h-11 ${isPasswordField ? "pr-10" : ""}`}
                      />
                      {isPasswordField && (
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(param.name!)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                    {errors[param.name! as keyof FormData] && (
                      <p className="flex items-center gap-1 text-sm text-red-600">
                        <span>⚠️</span>{" "}
                        {errors[param.name! as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                );
              })}

            <DialogFooter className="gap-2 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createCredential.isPending}
                className="h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCredential.isPending}
                className="h-10 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createCredential.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Credential
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
