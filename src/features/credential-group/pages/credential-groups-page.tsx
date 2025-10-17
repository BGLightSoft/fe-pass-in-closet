import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";
import { Card, CardContent } from "@/shared/ui/card";
import { FolderTree, Info, Layers, Key } from "lucide-react";
import { useState } from "react";
import { CreateCredentialGroupForm } from "../components/create-credential-group-form";
import { CredentialGroupTree } from "../components/credential-group-tree";
import { useCredentialGroups } from "../hooks/use-credential-groups";
import { useDeleteCredentialGroup } from "../hooks/use-delete-credential-group";
import { CredentialList } from "@/features/credential/components/credential-list";
import { useCredentials } from "@/features/credential/hooks/use-credentials";
import { useDeleteCredential } from "@/features/credential/hooks/use-delete-credential";
import { CreateCredentialForm } from "@/features/credential/components/create-credential-form";

export default function CredentialGroupsPage() {
  const { data: groups, isLoading } = useCredentialGroups();
  const { mutate: deleteGroup } = useDeleteCredentialGroup();
  const { currentWorkspace } = useWorkspaceStore();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null
  );

  const { data: credentials, isLoading: isLoadingCredentials } = useCredentials(
    selectedGroupId || undefined
  );
  const { mutate: deleteCredential } = useDeleteCredential();

  const handleGroupSelect = (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-600">
            Loading credential groups...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-3">
            <FolderTree size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Credential Groups</h1>
            <p className="text-gray-600">
              Organize credentials in{" "}
              <span className="font-semibold text-blue-600">
                {currentWorkspace?.name || "your workspace"}
              </span>
            </p>
          </div>
        </div>
        <CreateCredentialGroupForm />
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Hierarchical Organization</p>
            <p className="mt-1 text-blue-700">
              Create groups and sub-groups to organize your credentials. Click
              on a group to view its credentials, or use the{" "}
              <Layers className="inline" size={14} /> icon to create a
              sub-group.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sol Taraf - Credential Groups Tree */}
        <div className="lg:col-span-5">
          <CredentialGroupTree
            groups={groups || []}
            onDelete={deleteGroup}
            onSelect={handleGroupSelect}
            selectedGroupId={selectedGroupId}
          />
        </div>

        {/* Sağ Taraf - Credentials */}
        <div className="lg:col-span-7">
          {selectedGroupId ? (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Key size={24} className="text-blue-600" />
                    <div>
                      <h2 className="text-xl font-bold">{selectedGroupName}</h2>
                      <p className="text-sm text-gray-600">
                        Credentials in this group
                      </p>
                    </div>
                  </div>
                  <CreateCredentialForm groupId={selectedGroupId} />
                </div>
                {isLoadingCredentials ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                      <p className="mt-2 text-sm text-gray-600">
                        Loading credentials...
                      </p>
                    </div>
                  </div>
                ) : (
                  <CredentialList
                    credentials={credentials || []}
                    onDelete={deleteCredential}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="rounded-full bg-gray-100 p-4">
                  <Key size={48} className="text-gray-400" />
                </div>
                <p className="mt-4 text-lg font-medium text-gray-900">
                  Select a group to view credentials
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Click on any credential group from the left to see its
                  credentials
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
