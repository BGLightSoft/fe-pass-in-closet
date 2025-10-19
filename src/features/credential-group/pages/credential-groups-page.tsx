import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useState, useEffect } from "react";
import { CreateCredentialGroupForm } from "../components/create-credential-group-form";
import { CredentialGroupTree } from "../components/credential-group-tree";
import { useCredentialGroups } from "../hooks/use-credential-groups";
import { useDeleteCredentialGroup } from "../hooks/use-delete-credential-group";
import { CredentialList } from "@/features/credential/components/draggable-credential-list";
import { useCredentials } from "@/features/credential/hooks/use-credentials";
import { useDeleteCredential } from "@/features/credential/hooks/use-delete-credential";
import { CreateCredentialForm } from "@/features/credential/components/create-credential-form";
import {
  FolderTree,
  Key,
  Layers,
  Info,
  Sparkles,
  ChevronRight,
  Lock,
  Plus,
  Search,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";
import { Input } from "@/shared/ui/input";
import {
  getCredentialGroupTypeIcon,
  getCredentialGroupTypeColor,
} from "@/shared/lib/credential-group-type-icons";

export default function CredentialGroupsPage() {
  const { data: groups, isLoading: isLoadingGroups } = useCredentialGroups();
  const { mutate: deleteGroup } = useDeleteCredentialGroup();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null
  );
  const [selectedGroupTypeId, setSelectedGroupTypeId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [groupPath, setGroupPath] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isCreateCredentialOpen, setIsCreateCredentialOpen] = useState(false);

  // Calculate which groups should be auto-expanded (all groups in the path to selected)
  const calculateExpandedGroupIds = (): Set<string> => {
    if (!selectedGroupId || groupPath.length === 0) {
      return new Set();
    }
    // Expand all groups in the path except the last one (which is the selected group itself)
    return new Set(groupPath.slice(0, -1).map((item) => item.id));
  };

  const expandedGroupIds = calculateExpandedGroupIds();

  const {
    data: credentials,
    isLoading: isLoadingCredentials,
    error: credentialsError,
  } = useCredentials(selectedGroupId || "");

  const { mutate: deleteCredential } = useDeleteCredential();

  // Helper: Find group by ID
  const findGroupById = (groups: any[], id: string): any => {
    for (const group of groups) {
      if (group.id === id) return group;
      if (group.children) {
        const found = findGroupById(group.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: Build path to a group
  const buildGroupPath = (
    groups: any[],
    targetId: string,
    currentPath: Array<{ id: string; name: string }> = []
  ): Array<{ id: string; name: string }> | null => {
    for (const group of groups) {
      const newPath = [...currentPath, { id: group.id, name: group.name }];
      if (group.id === targetId) {
        return newPath;
      }
      if (group.children) {
        const found = buildGroupPath(group.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const handleGroupSelect = (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);

    const selectedGroup = findGroupById(groups || [], groupId);
    setSelectedGroupTypeId(selectedGroup?.credentialGroupTypeId || null);

    // Build and set the path
    const path = buildGroupPath(groups || [], groupId);
    setGroupPath(path || []);
  };

  // Navigation: Go to parent group
  const handleGoToParent = () => {
    if (groupPath.length > 1) {
      const parentGroup = groupPath[groupPath.length - 2];
      if (parentGroup) {
        handleGroupSelect(parentGroup.id, parentGroup.name);
      }
    }
  };

  // Navigation: Go to root (clear selection)
  const handleGoToRoot = () => {
    setSelectedGroupId(null);
    setSelectedGroupName(null);
    setSelectedGroupTypeId(null);
    setGroupPath([]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC: Go back or to root
      if (e.key === "Escape") {
        if (groupPath.length > 0) {
          e.preventDefault();
          if (groupPath.length === 1) {
            handleGoToRoot();
          } else {
            handleGoToParent();
          }
        }
      }
      // Alt+Home: Go to root
      if (e.altKey && e.key === "Home") {
        e.preventDefault();
        handleGoToRoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groupPath]);

  const handleGroupDelete = (groupId: string) => {
    const isSelectedGroupOrChild = (
      groups: any[],
      targetId: string,
      selectedId: string
    ): boolean => {
      if (targetId === selectedId) return true;

      for (const group of groups) {
        if (group.id === targetId) {
          const findChildById = (
            parentGroup: any,
            childId: string
          ): boolean => {
            if (parentGroup.id === childId) return true;
            if (parentGroup.children) {
              return parentGroup.children.some((child: any) =>
                findChildById(child, childId)
              );
            }
            return false;
          };
          return findChildById(group, selectedId);
        }
        if (group.children) {
          const found = isSelectedGroupOrChild(
            group.children,
            targetId,
            selectedId
          );
          if (found) return found;
        }
      }
      return false;
    };

    if (
      selectedGroupId &&
      isSelectedGroupOrChild(groups || [], groupId, selectedGroupId)
    ) {
      handleGoToRoot();
    }

    deleteGroup(groupId);
  };

  // Filter groups based on search
  const filterGroups = (groups: any[], query: string): any[] => {
    if (!query) return groups;

    return groups.reduce((acc: any[], group) => {
      const matchesSearch = group.name
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const filteredChildren = group.children
        ? filterGroups(group.children, query)
        : [];

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...group,
          children:
            filteredChildren.length > 0 ? filteredChildren : group.children,
        });
      }
      return acc;
    }, []);
  };

  const filteredGroups = searchQuery
    ? filterGroups(groups || [], searchQuery)
    : groups || [];

  return (
    <div className="space-y-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <Layers size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Credentials</h1>
              <p className="text-sm text-blue-100">
                Organize your credentials in a structured hierarchy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="flex items-start gap-3 p-3">
            <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={16} />
            <div className="text-xs">
              <p className="font-medium text-blue-900">
                How Credential Groups Work
              </p>
              <p className="mt-1 text-blue-700">
                Create root groups with specific types (Email, Server,
                Database), then add sub-groups and credentials. Each credential
                inherits its group's type and structure.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="flex items-start gap-3 p-3">
            <Sparkles
              className="mt-0.5 flex-shrink-0 text-purple-600"
              size={16}
            />
            <div className="text-xs">
              <p className="font-medium text-purple-900">
                ⌨️ Keyboard Shortcuts
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-purple-700">
                <span className="rounded bg-white/50 px-1.5 py-0.5 font-mono">
                  ESC
                </span>
                <span>Go back</span>
                <span className="text-purple-400">•</span>
                <span className="rounded bg-white/50 px-1.5 py-0.5 font-mono">
                  Alt+Home
                </span>
                <span>Go to root</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-10">
        {/* Left Panel - Groups Tree */}
        <div className="lg:col-span-3">
          <Card className="sticky top-6 shadow-md border-gray-300">
            <CardContent className="p-0">
              {/* Search Header */}
              <div className="border-b border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree size={16} className="text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">
                      Groups
                    </h2>
                    {groups && groups.length > 0 && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {groups.length}
                      </span>
                    )}
                  </div>
                  <CreateCredentialGroupForm />
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-xs h-8"
                  />
                </div>
              </div>

              {/* Groups Tree */}
              <div className="max-h-[calc(100vh-20rem)] overflow-y-auto p-3">
                {isLoadingGroups ? (
                  <div className="flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
                      <p className="mt-2 text-xs text-gray-600">
                        Loading groups...
                      </p>
                    </div>
                  </div>
                ) : !filteredGroups || filteredGroups.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-3 inline-flex rounded-full bg-blue-100 p-3">
                      <Layers size={24} className="text-blue-600" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-gray-900">
                      {searchQuery ? "No groups found" : "No groups yet"}
                    </p>
                    <p className="mb-3 text-xs text-gray-500">
                      {searchQuery
                        ? "Try a different search term"
                        : "Create your first group to get started"}
                    </p>
                    {!searchQuery && <CreateCredentialGroupForm />}
                  </div>
                ) : (
                  <CredentialGroupTree
                    groups={filteredGroups}
                    onDelete={handleGroupDelete}
                    onSelect={handleGroupSelect}
                    selectedGroupId={selectedGroupId}
                    expandedGroupIds={expandedGroupIds}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Credentials */}
        <div className="lg:col-span-7">
          {selectedGroupId ? (
            <Card className="shadow-md border-gray-300">
              <CardContent className="p-0">
                {/* Navigation Bar */}
                {groupPath.length > 0 && (
                  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2">
                    <div className="flex items-center justify-between gap-3">
                      {/* Breadcrumb */}
                      <div className="flex flex-1 items-center gap-1.5 overflow-x-auto text-xs">
                        <button
                          type="button"
                          onClick={handleGoToRoot}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                          title="Go to root (Alt+Home)"
                        >
                          <Home size={14} />
                          <span className="font-medium">Root</span>
                        </button>
                        {groupPath.map((pathItem, index) => (
                          <div
                            key={pathItem.id}
                            className="flex items-center gap-1.5"
                          >
                            <ChevronRight size={12} className="text-gray-400" />
                            <button
                              type="button"
                              onClick={() =>
                                handleGroupSelect(pathItem.id, pathItem.name)
                              }
                              className={`max-w-[150px] truncate rounded-md px-2 py-1 transition-colors ${
                                index === groupPath.length - 1
                                  ? "bg-blue-100 font-semibold text-blue-700"
                                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                              }`}
                              title={pathItem.name}
                            >
                              {pathItem.name}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center gap-1.5">
                        {groupPath.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleGoToParent}
                            className="h-7 gap-1.5 text-xs"
                            title="Go to parent group (ESC)"
                          >
                            <ArrowLeft size={14} />
                            <span>Back</span>
                          </Button>
                        )}
                        {groupPath.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleGoToRoot}
                            className="h-7 gap-1.5 text-xs"
                            title="Go to root (Alt+Home)"
                          >
                            <Home size={14} />
                            <span>Home</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Credentials Header */}
                <div className="border-b border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FolderTree size={12} />
                        <span>Selected Group</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {selectedGroupTypeId &&
                          (() => {
                            const TypeIcon =
                              getCredentialGroupTypeIcon(selectedGroupTypeId);
                            const typeColor =
                              getCredentialGroupTypeColor(selectedGroupTypeId);
                            return <TypeIcon size={20} className={typeColor} />;
                          })()}
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedGroupName}
                        </h2>
                      </div>
                      {credentials && (
                        <p className="mt-1 text-xs text-gray-600">
                          {credentials.length}{" "}
                          {credentials.length === 1
                            ? "credential"
                            : "credentials"}{" "}
                          stored securely
                        </p>
                      )}
                    </div>
                    {selectedGroupTypeId && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setIsCreateCredentialOpen(true)}
                          className="gap-1.5"
                        >
                          <Plus size={16} />
                          Add Credential
                        </Button>
                        <CreateCredentialForm
                          credentialGroupId={selectedGroupId}
                          credentialGroupTypeId={selectedGroupTypeId}
                          credentialGroupName={selectedGroupName || undefined}
                          open={isCreateCredentialOpen}
                          onOpenChange={setIsCreateCredentialOpen}
                        />
                      </>
                    )}
                  </div>

                  {/* Quick Stats */}
                  {credentials && credentials.length > 0 && (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-green-700">
                        <Lock size={12} />
                        <span className="font-medium">Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-700">
                        <Sparkles size={12} />
                        <span className="font-medium">Drag to reorder</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Credentials List */}
                <div className="p-4">
                  {isLoadingCredentials ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                        <p className="mt-2 text-xs text-gray-600">
                          Loading credentials...
                        </p>
                      </div>
                    </div>
                  ) : credentialsError ? (
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-red-900">
                          Error loading credentials. Please try again.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <CredentialList
                      credentials={credentials || []}
                      onDelete={deleteCredential}
                      credentialGroupId={selectedGroupId}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-gray-300 shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="relative mb-4">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-blue-100 blur-xl" />
                  <div className="relative rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-4">
                    <Key size={32} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  👈 Select a Group
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Click on any credential group from the left panel to view and
                  manage its credentials
                </p>
                <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-1">
                      <Plus size={10} className="text-blue-600" />
                    </div>
                    <span>Create groups to organize your credentials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-1">
                      <Layers size={10} className="text-blue-600" />
                    </div>
                    <span>Nest groups for hierarchical organization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <Lock size={10} className="text-green-600" />
                    </div>
                    <span>All credentials are encrypted securely</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-1">
                      <Sparkles size={10} className="text-purple-600" />
                    </div>
                    <span>Use ESC to navigate back easily</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
