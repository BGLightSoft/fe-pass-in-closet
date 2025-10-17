import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import {
  type CreateWorkspaceRequest,
  createWorkspaceRequestSchema,
} from "../schemas/workspace-schemas";

export function CreateWorkspaceForm() {
  const {
    mutate: createWorkspace,
    isPending,
    isSuccess,
  } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWorkspaceRequest>({
    resolver: zodResolver(createWorkspaceRequestSchema),
  });

  const onSubmit = (data: CreateWorkspaceRequest) => {
    createWorkspace(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus size={20} />
          Create New Workspace
        </CardTitle>
        <CardDescription>
          Create a new workspace to organize your credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              placeholder="e.g., Personal, Work, Client X"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Workspace"}
          </Button>

          {isSuccess && (
            <p className="text-sm text-green-600">
              Workspace created successfully!
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
