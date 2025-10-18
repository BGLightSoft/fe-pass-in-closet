import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Key,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import React, { useState } from "react";
import type { Credential } from "../schemas/credential-schemas";
import { useToast } from "@/shared/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { toTitleCase } from "@/shared/lib/format-utils";
import { EditCredentialForm } from "./edit-credential-form";
import { EditCredentialParameterDialog } from "./edit-credential-parameter-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateCredentialOrder } from "../hooks/use-update-credential-order";

interface CredentialListProps {
  credentials: Credential[];
  onDelete: (id: string) => void;
  credentialGroupId: string;
}

interface SortableCredentialItemProps {
  credential: Credential;
  onDelete: (id: string) => void;
  visiblePasswords: Set<string>;
  expandedCredentials: Set<string>;
  togglePasswordVisibility: (credentialId: string) => void;
  toggleCredentialExpansion: (credentialId: string) => void;
  copyToClipboard: (text: string) => void;
}

function SortableCredentialItem({
  credential,
  onDelete,
  visiblePasswords,
  expandedCredentials,
  togglePasswordVisibility,
  toggleCredentialExpansion,
  copyToClipboard,
}: SortableCredentialItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: credential.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isPasswordVisible = visiblePasswords.has(credential.id);
  const isExpanded = expandedCredentials.has(credential.id);

  return (
    <div ref={setNodeRef} style={style} className="space-y-3">
      <Card
        className={`overflow-hidden border-gray-300 ${
          isDragging ? "shadow-lg border-blue-400" : ""
        }`}
      >
        <CardHeader
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleCredentialExpansion(credential.id)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                title="Drag to reorder"
              >
                <GripVertical size={16} className="text-gray-400" />
              </div>
              {isExpanded ? (
                <ChevronDown size={20} className="text-blue-600" />
              ) : (
                <ChevronRight size={20} className="text-blue-600" />
              )}
              <Key size={20} className="text-blue-600" />
              <span>{credential.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {credential.parameters
                  ? Object.keys(credential.parameters).length
                  : 0}{" "}
                parameters
              </span>
              <EditCredentialForm credential={credential} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    title="Delete credential"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-red-600" size={24} />
                      Delete Credential?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-gray-900">
                        "{credential.name}"
                      </span>
                      ?
                      <div className="mt-3 rounded-lg bg-red-50 p-3">
                        <p className="font-medium text-red-900">
                          ⚠️ This will permanently delete all credential data.
                        </p>
                        <p className="mt-2 text-sm font-semibold text-red-900">
                          This action cannot be undone!
                        </p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(credential.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Credential
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>

        {isExpanded && (
          <CardContent className="border-t border-gray-300 bg-gray-50">
            {credential.parameters && (
              <div className="space-y-3">
                {Object.entries(credential.parameters)
                  .filter(
                    ([key]) =>
                      !["isActive", "createdAt", "updatedAt", "index"].includes(
                        key
                      )
                  )
                  .map(([key, value]) => {
                    const isPasswordField = key
                      .toLowerCase()
                      .includes("password");
                    const displayValue =
                      isPasswordField && !isPasswordVisible
                        ? "••••••••••"
                        : String(value);
                    const formattedLabel = toTitleCase(key);

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-3"
                      >
                        <div className="flex-1">
                          <div className="text-xs font-medium uppercase text-gray-500">
                            {formattedLabel}
                          </div>
                          <div className="mt-1 font-mono text-sm">
                            {displayValue}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <EditCredentialParameterDialog
                            credential={credential}
                            parameterKey={key}
                            parameterValue={String(value)}
                            parameterLabel={formattedLabel}
                          />
                          {isPasswordField && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                togglePasswordVisibility(credential.id)
                              }
                            >
                              {isPasswordVisible ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(String(value))}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                <div className="mt-4 flex gap-4 text-xs text-gray-500">
                  <div>
                    Created:{" "}
                    {credential.parameters.createdAt
                      ? new Date(
                          credential.parameters.createdAt as string
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div>
                    Updated:{" "}
                    {credential.parameters.updatedAt
                      ? new Date(
                          credential.parameters.updatedAt as string
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export function CredentialList({
  credentials,
  onDelete,
  credentialGroupId,
}: CredentialListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );
  const [expandedCredentials, setExpandedCredentials] = useState<Set<string>>(
    new Set()
  );
  const [localCredentials, setLocalCredentials] = useState(credentials);
  const { toast } = useToast();
  const { mutate: updateOrder } = useUpdateCredentialOrder();

  // Update local state when credentials prop changes
  React.useEffect(() => {
    setLocalCredentials(credentials);
  }, [credentials]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const togglePasswordVisibility = (credentialId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(credentialId)) {
        newSet.delete(credentialId);
      } else {
        newSet.add(credentialId);
      }
      return newSet;
    });
  };

  const toggleCredentialExpansion = (credentialId: string) => {
    setExpandedCredentials((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(credentialId)) {
        newSet.delete(credentialId);
      } else {
        newSet.add(credentialId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✨ Copied to clipboard",
      description: "The value has been copied successfully.",
      variant: "default",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localCredentials.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = localCredentials.findIndex(
        (item) => item.id === over?.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedCredentials = arrayMove(
          localCredentials,
          oldIndex,
          newIndex
        );

        // Optimistically update local state
        setLocalCredentials(reorderedCredentials);

        // Update order in backend
        const orderData = reorderedCredentials.map((credential, index) => ({
          credentialId: credential.id,
          index: index,
        }));

        updateOrder({
          groupId: credentialGroupId,
          data: { credentials: orderData },
        });
      }
    }
  };

  if (!localCredentials || localCredentials.length === 0) {
    return (
      <Card className="border-gray-300">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">
            No credentials found in this group. Create your first credential!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localCredentials.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {localCredentials.map((credential) => (
            <SortableCredentialItem
              key={credential.id}
              credential={credential}
              onDelete={onDelete}
              visiblePasswords={visiblePasswords}
              expandedCredentials={expandedCredentials}
              togglePasswordVisibility={togglePasswordVisibility}
              toggleCredentialExpansion={toggleCredentialExpansion}
              copyToClipboard={copyToClipboard}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
