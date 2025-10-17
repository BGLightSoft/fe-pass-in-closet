import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { credentialApi } from "../api/credential-api";

export default function CredentialsPage() {
  const { groupId } = useParams<{ groupId: string }>();

  const { data: credentials, isLoading } = useQuery({
    queryKey: ["credentials", groupId],
    queryFn: () => credentialApi.getByGroup(groupId!),
    enabled: !!groupId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Credentials</h1>

      <div className="grid gap-4">
        {credentials?.map((credential) => (
          <Card key={credential.id}>
            <CardHeader>
              <CardTitle>{credential.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {credential.parameters && (
                <div className="space-y-2">
                  {Object.entries(credential.parameters).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
