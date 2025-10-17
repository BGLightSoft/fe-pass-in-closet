import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Key, ArrowLeft } from "lucide-react";
import { CredentialList } from "../components/credential-list";
import { useCredentials } from "../hooks/use-credentials";
import { useDeleteCredential } from "../hooks/use-delete-credential";

export default function CredentialsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: credentials, isLoading } = useCredentials(groupId);
  const { mutate: deleteCredential } = useDeleteCredential();

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/credential-groups")}
        >
          <ArrowLeft size={16} />
          Back to Groups
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Key size={32} className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-gray-600">Manage your credentials and passwords</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CredentialList
            credentials={credentials || []}
            onDelete={deleteCredential}
          />
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Create Credential</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create credential functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
