import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Key, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { Credential } from "../schemas/credential-schemas";

interface CredentialListProps {
  credentials: Credential[];
  onDelete: (id: string) => void;
}

export function CredentialList({ credentials, onDelete }: CredentialListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
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
    <div className="space-y-4">
      {credentials.map((credential) => {
        const isPasswordVisible = visiblePasswords.has(credential.id);

        return (
          <Card key={credential.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={20} className="text-blue-600" />
                  <span>{credential.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Delete "${credential.name}"?`)) {
                      onDelete(credential.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {credential.parameters && (
                <div className="space-y-3">
                  {Object.entries(credential.parameters)
                    .filter(
                      ([key]) =>
                        !["isActive", "createdAt", "updatedAt"].includes(key)
                    )
                    .map(([key, value]) => {
                      const isPasswordField = key
                        .toLowerCase()
                        .includes("password");
                      const displayValue =
                        isPasswordField && !isPasswordVisible
                          ? "••••••••••"
                          : String(value);

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                        >
                          <div className="flex-1">
                            <div className="text-xs font-medium uppercase text-gray-500">
                              {key}
                            </div>
                            <div className="mt-1 font-mono text-sm">
                              {displayValue}
                            </div>
                          </div>
                          <div className="flex gap-1">
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
          </Card>
        );
      })}
    </div>
  );
}
