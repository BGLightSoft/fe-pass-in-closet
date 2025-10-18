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
import { useUpdateCredential } from "../hooks/use-update-credential";
import { z } from "zod";
import type { Credential } from "../schemas/credential-schemas";

interface EditCredentialParameterDialogProps {
  credential: Credential;
  parameterKey: string;
  parameterValue: string;
  parameterLabel: string;
}

const parameterSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

type ParameterFormData = z.infer<typeof parameterSchema>;

export function EditCredentialParameterDialog({
  credential,
  parameterKey,
  parameterValue,
  parameterLabel,
}: EditCredentialParameterDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateCredential, isPending } = useUpdateCredential();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ParameterFormData>({
    resolver: zodResolver(parameterSchema),
    defaultValues: {
      value: parameterValue,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({ value: parameterValue });
    }
  }, [open, parameterValue, reset]);

  const onSubmit = (data: ParameterFormData) => {
    // Update only this specific parameter
    const updatedParameters = {
      ...credential.parameters,
      [parameterKey]: data.value,
    } as Record<string, string>;

    updateCredential(
      {
        id: credential.id,
        data: {
          parameters: updatedParameters,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const isPasswordField = parameterKey.toLowerCase().includes("password");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          title={`Edit ${parameterLabel}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Edit size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="text-blue-600" size={24} />
            Edit {parameterLabel}
          </DialogTitle>
          <DialogDescription className="text-base">
            Update the value for{" "}
            <span className="font-semibold text-gray-900">
              {credential.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="value" className="text-base">
              {parameterLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="value"
              type={isPasswordField ? "password" : "text"}
              placeholder={`Enter new ${parameterLabel.toLowerCase()}`}
              className="h-11 text-base font-mono"
              autoFocus
              {...register("value")}
            />
            {errors.value && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.value.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Current:{" "}
              <span className="font-mono">
                {isPasswordField ? "••••••••" : parameterValue}
              </span>
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
                  Update {parameterLabel}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
