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
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { CredentialGroup } from "../schemas/credential-group-schemas";
import { CreateCredentialGroupForm } from "./create-credential-group-form";

interface CredentialGroupNodeProps {
  group: CredentialGroup;
  level?: number;
  onDelete: (id: string) => void;
  onSelect?: (groupId: string, groupName: string) => void;
  selectedGroupId?: string | null;
}

function CredentialGroupNode({
  group,
  level = 0,
  onDelete,
  onSelect,
  selectedGroupId,
}: CredentialGroupNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = group.children && group.children.length > 0;
  const isSelected = selectedGroupId === group.id;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(group.id, group.name || "Unnamed Group");
    }
  };

  return (
    <div className="space-y-1">
      <div
        className={`group flex items-center gap-2 rounded-lg p-2 transition-colors ${
          isSelected ? "bg-blue-100 shadow-sm" : "hover:bg-blue-50"
        }`}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 rounded p-1 transition-colors hover:bg-blue-100"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
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

        <button
          type="button"
          className={`flex-1 cursor-pointer text-left transition-colors ${
            isSelected
              ? "text-blue-700 font-semibold"
              : "text-gray-900 hover:text-blue-600"
          }`}
          onClick={handleSelect}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{group.name}</span>
            {group.credentialGroupId === null &&
              group.credentialGroupTypeName && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {group.credentialGroupTypeName}
                </span>
              )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <span>
              {group.credentialCount}{" "}
              {group.credentialCount === 1 ? "credential" : "credentials"}
            </span>
            {group.totalCredentialCount > group.credentialCount && (
              <span className="text-gray-400">
                • {group.totalCredentialCount} total
              </span>
            )}
          </div>
        </button>

        <div
          className={`flex items-center gap-1 transition-opacity ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <CreateCredentialGroupForm
            parentId={group.id}
            parentName={group.name ?? undefined}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-red-600 hover:bg-red-100 hover:text-red-700"
                title="Delete group"
              >
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={24} />
                  Delete Credential Group?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    "{group.name}"
                  </span>
                  ?
                  <div className="mt-3 rounded-lg bg-red-50 p-3">
                    <p className="font-medium text-red-900">
                      ⚠️ This will permanently delete:
                    </p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
                      <li>All sub-groups within this group</li>
                      <li>All credentials in this group and sub-groups</li>
                      <li>All associated credential data</li>
                    </ul>
                    <p className="mt-2 text-sm font-semibold text-red-900">
                      This action cannot be undone!
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(group.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Group
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              onSelect={onSelect}
              selectedGroupId={selectedGroupId}
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
  onSelect?: (groupId: string, groupName: string) => void;
  selectedGroupId?: string | null;
}

export function CredentialGroupTree({
  groups,
  onDelete,
  onSelect,
  selectedGroupId,
}: CredentialGroupTreeProps) {
  if (!groups || groups.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="rounded-full bg-gray-100 p-4">
            <Folder size={48} className="text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-900">
            No credential groups yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Create your first group to organize your credentials
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="text-blue-600" size={20} />
          Your Credential Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-4">
        {groups.map((group) => (
          <CredentialGroupNode
            key={group.id}
            group={group}
            onDelete={onDelete}
            onSelect={onSelect}
            selectedGroupId={selectedGroupId}
          />
        ))}
      </CardContent>
    </Card>
  );
}
