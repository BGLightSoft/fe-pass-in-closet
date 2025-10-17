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
import { useForm } from "react-hook-form";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import {
  type CreateWorkspaceRequest,
  createWorkspaceRequestSchema,
} from "../schemas/workspace-schemas";
import { toast } from "@/shared/ui/use-toast";

export function CreateWorkspaceForm() {
  const [open, setOpen] = useState(false);
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWorkspaceRequest>({
    resolver: zodResolver(createWorkspaceRequestSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateWorkspaceRequest) => {
    createWorkspace(data, {
      onSuccess: (workspace) => {
        toast({
          variant: "success",
          title: "✨ Workspace created!",
          description: `${workspace.name} has been created and selected.`,
        });
        reset();
        setOpen(false);
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "❌ Failed to create workspace",
          description: error.message || "Please try again later.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus size={20} />
          Create New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-blue-600" size={24} />
            Create New Workspace
          </DialogTitle>
          <DialogDescription className="text-base">
            Workspaces help you organize your credentials by project, team, or
            any way you like.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Personal, Work, Client Projects"
              className="h-11 text-base"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.name.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Choose a descriptive name that helps you identify this workspace
              easily.
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
                  Create Workspace
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
