import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { FolderTree } from "lucide-react";
import { CredentialGroupTree } from "../components/credential-group-tree";
import { useCredentialGroups } from "../hooks/use-credential-groups";
import { useDeleteCredentialGroup } from "../hooks/use-delete-credential-group";

export default function CredentialGroupsPage() {
  const { data: groups, isLoading } = useCredentialGroups();
  const { mutate: deleteGroup } = useDeleteCredentialGroup();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderTree size={32} className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Credential Groups</h1>
          <p className="text-gray-600">
            Organize your credentials in hierarchical groups
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CredentialGroupTree groups={groups || []} onDelete={deleteGroup} />
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Create Group</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create credential group functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
