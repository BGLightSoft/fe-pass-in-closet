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
import { Loader2, Plus } from "lucide-react";
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
  const createCredential = useCreateCredential();

  const { data: parameterList, isLoading: isLoadingParameters } =
    useCredentialParameterList(credentialGroupTypeId);

  // Dynamic form schema based on parameter list
  const formSchema = z.object({
    name: z.string().min(1, "Credential name is required").max(255),
    ...Object.fromEntries(
      (parameterList || []).map((param) => [
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus size={16} />
          New Credential
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Credential</DialogTitle>
          <DialogDescription>
            Add a new credential to{" "}
            <span className="font-semibold text-gray-900">
              {credentialGroupName || "this group"}
            </span>
          </DialogDescription>
        </DialogHeader>

        {isLoadingParameters ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Credential Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Credential Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Production Database"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Dynamic Parameter Inputs */}
            {parameterList?.map((param) => {
              const formattedLabel = toTitleCase(param.name!);
              return (
                <div key={param.id} className="space-y-2">
                  <Label htmlFor={param.name!}>
                    {formattedLabel} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={param.name!}
                    type={
                      param.name?.toLowerCase().includes("password")
                        ? "password"
                        : "text"
                    }
                    placeholder={
                      (param.data as { placeholder?: string })?.placeholder ||
                      `Enter ${formattedLabel.toLowerCase()}`
                    }
                    {...register(param.name! as keyof FormData)}
                  />
                  {errors[param.name! as keyof FormData] && (
                    <p className="text-sm text-red-600">
                      {errors[param.name! as keyof FormData]?.message}
                    </p>
                  )}
                </div>
              );
            })}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createCredential.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCredential.isPending}>
                {createCredential.isPending ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Creating...
                  </>
                ) : (
                  "Create Credential"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
