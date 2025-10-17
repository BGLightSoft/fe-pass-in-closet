import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useQuery } from "@tanstack/react-query";
import { credentialGroupApi } from "../api/credential-group-api";

export default function CredentialGroupsPage() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["credential-groups"],
    queryFn: credentialGroupApi.getAll,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Credential Groups</h1>

      <div className="grid gap-4">
        {groups?.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Group ID: {group.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
