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
} from "lucide-react";
import { useState } from "react";
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

interface CredentialListProps {
  credentials: Credential[];
  onDelete: (id: string) => void;
}

export function CredentialList({ credentials, onDelete }: CredentialListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );
  const [expandedCredentials, setExpandedCredentials] = useState<Set<string>>(
    new Set()
  );
  const { toast } = useToast();

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

  if (!credentials || credentials.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">
            No credentials found in this group. Create your first credential!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {credentials.map((credential) => {
        const isPasswordVisible = visiblePasswords.has(credential.id);
        const isExpanded = expandedCredentials.has(credential.id);

        return (
          <Card key={credential.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCredentialExpansion(credential.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                              ⚠️ This will permanently delete all credential
                              data.
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
              <CardContent className="border-t bg-gray-50">
                {credential.parameters && (
                  <div className="space-y-3">
                    {Object.entries(credential.parameters)
                      .filter(
                        ([key]) =>
                          ![
                            "isActive",
                            "createdAt",
                            "updatedAt",
                            "index",
                          ].includes(key)
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
                            className="flex items-center justify-between rounded-lg border bg-white p-3"
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
        );
      })}
    </div>
  );
}
