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
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCredential } from "../hooks/use-create-credential";

const createCredentialFormSchema = z.object({
  name: z.string().min(1, "Credential name is required").max(255),
});

type CreateCredentialFormValues = z.infer<typeof createCredentialFormSchema>;

interface CreateCredentialFormProps {
  groupId: string;
}

export function CreateCredentialForm({ groupId }: CreateCredentialFormProps) {
  const [open, setOpen] = useState(false);
  const [parameters, setParameters] = useState<
    Array<{ key: string; value: string }>
  >([{ key: "", value: "" }]);
  const { mutate: createCredential, isPending } = useCreateCredential();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCredentialFormValues>({
    resolver: zodResolver(createCredentialFormSchema),
  });

  const addParameter = () => {
    setParameters([...parameters, { key: "", value: "" }]);
  };

  const removeParameter = (index: number) => {
    if (parameters.length > 1) {
      setParameters(parameters.filter((_, i) => i !== index));
    }
  };

  const updateParameter = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  const onSubmit = (data: CreateCredentialFormValues) => {
    console.log("🔍 Form Submit Debug:", {
      formData: data,
      parameters,
      groupId,
    });

    // Manual validation for parameters
    const validParameters = parameters.filter(
      (param) => param.key.trim() && param.value.trim()
    );

    if (validParameters.length === 0) {
      console.error("❌ No valid parameters provided");
      return;
    }

    const parametersObject = validParameters.reduce((acc, param) => {
      acc[param.key] = param.value;
      return acc;
    }, {} as Record<string, string>);

    console.log("🔍 Final Payload:", {
      credentialGroupId: groupId,
      name: data.name,
      parameters: parametersObject,
    });

    createCredential(
      {
        credentialGroupId: groupId,
        name: data.name,
        parameters: parametersObject,
      },
      {
        onSuccess: () => {
          console.log("✅ Credential created successfully");
          setOpen(false);
          reset();
          setParameters([{ key: "", value: "" }]);
        },
        onError: (error) => {
          console.error("❌ Credential creation failed:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Create Credential
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Credential</DialogTitle>
          <DialogDescription>
            Add a new credential with custom parameters to this group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Credential Name</Label>
            <Input
              id="name"
              placeholder="e.g. Production Database, Gmail Account"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Parameters</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addParameter}
                className="gap-1"
              >
                <Plus size={14} />
                Add Parameter
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Add custom key-value pairs for your credential (e.g., username,
              password, host, port).
            </p>

            <div className="space-y-2">
              {parameters.map((param, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Key (e.g., username)"
                    value={param.key}
                    onChange={(e) =>
                      updateParameter(index, "key", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) =>
                      updateParameter(index, "value", e.target.value)
                    }
                    className="flex-1"
                    type={
                      param.key.toLowerCase().includes("password")
                        ? "password"
                        : "text"
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeParameter(index)}
                    disabled={parameters.length === 1}
                    className="flex-shrink-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
                setParameters([{ key: "", value: "" }]);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Credential"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
