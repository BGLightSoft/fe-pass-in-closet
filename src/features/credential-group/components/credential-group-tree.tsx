import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Trash2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import type { CredentialGroup } from "../schemas/credential-group-schemas";
import { useNavigate } from "react-router-dom";

interface CredentialGroupNodeProps {
  group: CredentialGroup;
  level?: number;
  onDelete: (id: string) => void;
}

function CredentialGroupNode({
  group,
  level = 0,
  onDelete,
}: CredentialGroupNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = group.children && group.children.length > 0;
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      <div
        className="group flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 rounded p-1 hover:bg-gray-200"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {isExpanded ? (
          <FolderOpen size={18} className="flex-shrink-0 text-blue-600" />
        ) : (
          <Folder size={18} className="flex-shrink-0 text-gray-500" />
        )}

        <span
          className="flex-1 cursor-pointer font-medium text-gray-900 hover:text-blue-600"
          onClick={() => navigate(`/credentials/${group.id}`)}
        >
          {group.name}
        </span>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // TODO: Create child group
              alert("Create sub-group functionality coming soon!");
            }}
          >
            <Plus size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (confirm(`Delete "${group.name}"?`)) {
                onDelete(group.id);
              }
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {group.children?.map((child) => (
            <CredentialGroupNode
              key={child.id}
              group={child}
              level={level + 1}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CredentialGroupTreeProps {
  groups: CredentialGroup[];
  onDelete: (id: string) => void;
}

export function CredentialGroupTree({
  groups,
  onDelete,
}: CredentialGroupTreeProps) {
  if (!groups || groups.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">
            No credential groups found. Create your first group!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credential Groups Tree</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {groups.map((group) => (
          <CredentialGroupNode
            key={group.id}
            group={group}
            onDelete={onDelete}
          />
        ))}
      </CardContent>
    </Card>
  );
}
