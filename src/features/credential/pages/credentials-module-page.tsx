import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Search,
  Plus,
  FolderTree,
  Server,
  Database,
  Globe,
  Shield,
  ChevronRight,
  Home,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  MoreVertical,
  Mail,
  Gamepad2,
  Cloud,
  Smartphone,
  Key,
  ChevronDown,
  ChevronUp,
  Users,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useCredentialGroups } from "@/features/credential-group/hooks/use-credential-groups";
import { credentialApi } from "@/features/credential/api/credential-api";
import { useCreateCredentialGroup } from "@/features/credential-group/hooks/use-create-credential-group";
import { useUpdateCredentialGroup } from "@/features/credential-group/hooks/use-update-credential-group";
import { useDeleteCredentialGroup } from "@/features/credential-group/hooks/use-delete-credential-group";
import { useCreateCredential } from "@/features/credential/hooks/use-create-credential";
import { useUpdateCredential } from "@/features/credential/hooks/use-update-credential";
import { useDeleteCredential } from "@/features/credential/hooks/use-delete-credential";
import { CreateCredentialGroupForm } from "@/features/credential-group/components/create-credential-group-form";
import { EditCredentialGroupForm } from "@/features/credential-group/components/edit-credential-group-form";
import { CreateCredentialForm } from "@/features/credential/components/create-credential-form";
import { EditCredentialForm } from "@/features/credential/components/edit-credential-form";
import { useToast } from "@/shared/ui/use-toast";
import { useCredentialGroupTypes } from "@/features/credential-group-type/hooks/use-credential-group-types";
import {
  getCredentialGroupTypeIcon,
  getCredentialGroupTypeColor,
  getCredentialGroupTypeBgColor,
} from "@/shared/lib/credential-group-type-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function CredentialsModulePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Dialog states
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showCreateCredential, setShowCreateCredential] = useState(false);
  const [showEditCredential, setShowEditCredential] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [editingCredential, setEditingCredential] = useState<any>(null);

  // Password visibility states
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});

  // Credential expand/collapse states
  const [expandedCredentials, setExpandedCredentials] = useState<
    Record<string, boolean>
  >({});

  // Her credential için benzersiz ID oluştur
  const getCredentialUniqueId = (credential: any, index: number) => {
    return `cred-${credential.id}-${
      credential.credentialGroupId
    }-${index}-${credential.name?.replace(/\s+/g, "-")}-${
      credential.createdAt
    }`;
  };

  const { toast } = useToast();

  // Mutation hooks
  const createGroupMutation = useCreateCredentialGroup();
  const updateGroupMutation = useUpdateCredentialGroup();
  const deleteGroupMutation = useDeleteCredentialGroup();
  const createCredentialMutation = useCreateCredential();
  const updateCredentialMutation = useUpdateCredential();
  const deleteCredentialMutation = useDeleteCredential();

  // API hooks
  const { data: credentialGroups, isLoading: groupsLoading } =
    useCredentialGroups();
  const { data: credentialGroupTypes } = useCredentialGroupTypes();

  // Flatten the hierarchical credential groups to get all groups
  const getAllGroups = (groups: any[]): any[] => {
    const result: any[] = [];

    const flatten = (groupList: any[]) => {
      for (const group of groupList) {
        result.push(group);
        if (group.children && group.children.length > 0) {
          flatten(group.children);
        }
      }
    };

    flatten(groups);
    return result;
  };

  // Get credential group type name by ID
  const getCredentialGroupTypeName = (
    typeId: string | null | undefined
  ): string => {
    if (!typeId || !credentialGroupTypes) return "Unknown";
    const type = credentialGroupTypes.find((t) => t.id === typeId);
    return type?.name || "Unknown";
  };

  // Get all credentials by fetching from all groups
  const getAllCredentials = async () => {
    if (!credentialGroups) return [];

    const allGroups = getAllGroups(credentialGroups);
    const allCredentials = [];

    // Fetch credentials from each group
    for (const group of allGroups) {
      try {
        const groupCredentials = await credentialApi.getByGroup(group.id);
        allCredentials.push(...groupCredentials);
      } catch (error) {
        // Silently handle error - group may be empty or inaccessible
      }
    }

    return allCredentials;
  };

  // Use React Query to manage credentials fetching
  const { data: credentials, isLoading: credentialsLoading } = useQuery({
    queryKey: ["all-credentials", credentialGroups],
    queryFn: getAllCredentials,
    enabled: !!credentialGroups,
  });

  // Get credential count for each group (including children)
  const getCredentialCount = (groupId: string) => {
    if (!credentialGroups) return 0;

    const allGroups = getAllGroups(credentialGroups);
    const group = allGroups.find((g) => g.id === groupId);

    if (group) {
      return group.totalCredentialCount || 0;
    }

    // Fallback: count credentials directly
    return (
      credentials?.filter((cred) => cred.credentialGroupId === groupId)
        .length || 0
    );
  };

  // Get groups to display (root groups or children of selected group)
  const getGroupsToDisplay = () => {
    if (!credentialGroups) return [];

    // Flatten all groups first
    const allGroups = getAllGroups(credentialGroups);

    const filtered = allGroups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGroupId) {
      // Show children of selected group
      return filtered.filter(
        (group) => group.credentialGroupId === selectedGroupId
      );
    } else {
      // Show root groups (no parent)
      return filtered.filter((group) => !group.credentialGroupId);
    }
  };

  const filteredGroups = getGroupsToDisplay();

  // Get credentials to display
  const getCredentialsToDisplay = () => {
    if (!credentials) return [];

    const filtered = credentials.filter((credential) =>
      credential.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGroupId) {
      // Show credentials in selected group
      return filtered.filter(
        (credential) => credential.credentialGroupId === selectedGroupId
      );
    } else {
      // Show all credentials
      return filtered;
    }
  };

  const filteredCredentials = getCredentialsToDisplay();

  // Get breadcrumb path
  const getBreadcrumbPath = () => {
    if (!selectedGroupId || !credentialGroups) return [];

    const path = [];
    const allGroups = getAllGroups(credentialGroups);
    let currentGroup = allGroups.find((g) => g.id === selectedGroupId);

    while (currentGroup) {
      path.unshift(currentGroup);
      currentGroup = allGroups.find(
        (g) => g.id === currentGroup.credentialGroupId
      );
    }

    return path;
  };

  const breadcrumbPath = getBreadcrumbPath();

  // Navigation Functions
  const handleGoToParent = () => {
    if (breadcrumbPath.length > 1) {
      const parentGroup = breadcrumbPath[breadcrumbPath.length - 2];
      if (parentGroup) {
        setSelectedGroupId(parentGroup.id);
      }
    } else if (breadcrumbPath.length === 1) {
      setSelectedGroupId(null);
    }
  };

  const handleGoToRoot = () => {
    setSelectedGroupId(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC: Go back or to root
      if (e.key === "Escape") {
        if (selectedGroupId) {
          e.preventDefault();
          if (breadcrumbPath.length === 1) {
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
  }, [selectedGroupId, breadcrumbPath]);

  // CRUD Functions
  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setShowEditGroup(true);
  };

  const handleDeleteGroup = async (group: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${group.name}"? This will also delete all credentials in this group.`
      )
    ) {
      try {
        await deleteGroupMutation.mutateAsync(group.id);
        toast({
          title: "Group deleted",
          description: `"${group.name}" has been deleted successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete group. Please try again.",
        });
      }
    }
  };

  const handleCreateCredential = () => {
    setShowCreateCredential(true);
  };

  const handleEditCredential = (credential: any) => {
    setEditingCredential(credential);
    setShowEditCredential(true);
  };

  const handleDeleteCredential = async (credential: any) => {
    if (
      window.confirm(`Are you sure you want to delete "${credential.name}"?`)
    ) {
      try {
        await deleteCredentialMutation.mutateAsync(credential.id);
        toast({
          title: "Credential deleted",
          description: `"${credential.name}" has been deleted successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete credential. Please try again.",
        });
      }
    }
  };

  const handleCopyParameter = (value: string, paramName: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: `${paramName} copied to clipboard.`,
    });
  };

  const togglePasswordVisibility = (
    credentialId: string,
    paramName: string
  ) => {
    const key = `${credentialId}-${paramName}`;
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Get icon for group type
  const getGroupIcon = (group: any) => {
    const typeName = getCredentialGroupTypeName(group.credentialGroupTypeId);
    const TypeIcon = getCredentialGroupTypeIcon(typeName);
    return <TypeIcon className="h-5 w-5 text-white" />;
  };

  // Toggle credential expand/collapse
  const toggleCredentialExpansion = (uniqueId: string) => {
    setExpandedCredentials((prev) => {
      // Sadece tıklanan credential'ın state'ini değiştir
      const newState = { ...prev };
      newState[uniqueId] = !prev[uniqueId];
      return newState;
    });
  };

  // Get icon for credential type
  const getCredentialIcon = (credential: any) => {
    // Get the credential group type name from the credential's group
    const allGroups = getAllGroups(credentialGroups || []);
    const credentialGroup = allGroups.find(
      (g) => g.id === credential.credentialGroupId
    );
    const typeName = getCredentialGroupTypeName(
      credentialGroup?.credentialGroupTypeId
    );

    const TypeIcon = getCredentialGroupTypeIcon(typeName);
    const typeColor = getCredentialGroupTypeColor(typeName);
    const bgColor = getCredentialGroupTypeBgColor(typeName);

    return (
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${bgColor}`}
      >
        <TypeIcon className={`h-4 w-4 ${typeColor}`} />
      </div>
    );
  };

  // Get connection info from credential parameters
  const getConnectionInfo = (credential: any) => {
    const params = credential.parameters || {};
    const username =
      params.username || params.user || params.email || "unknown";
    const protocol = params.protocol || "ssh";
    return `${protocol}, ${username}`;
  };

  return (
    <div className="space-y-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <Key size={24} className="text-white" />
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

      {/* Info Banners */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="flex items-start gap-3 p-3">
            <div className="mt-0.5 flex-shrink-0 text-blue-600 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
              i
            </div>
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search groups and credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Groups Section */}
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Groups</h2>

              {/* Navigation Buttons */}
              {breadcrumbPath.length > 0 && (
                <div className="flex items-center gap-1.5 ml-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGoToParent}
                    className="h-7 gap-1.5 text-xs"
                    title="Go back (ESC)"
                  >
                    <ArrowLeft size={14} />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGoToRoot}
                    className="h-7 gap-1.5 text-xs"
                    title="Go to root (Alt+Home)"
                  >
                    <Home size={14} />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </div>
              )}
            </div>

            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleCreateGroup}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </div>

          {/* Breadcrumb Path */}
          {breadcrumbPath.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 pl-1">
              <button
                onClick={handleGoToRoot}
                className="hover:text-blue-600 transition-colors"
                title="Go to root (Alt+Home)"
              >
                All Groups
              </button>
              {breadcrumbPath.map((group, index) => (
                <div key={group.id} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-gray-400" />
                  <button
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`hover:text-blue-600 transition-colors truncate max-w-[150px] ${
                      index === breadcrumbPath.length - 1
                        ? "text-blue-600 font-medium"
                        : ""
                    }`}
                    title={group.name}
                  >
                    {group.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {groupsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 w-24 rounded bg-gray-200 mb-2" />
                      <div className="h-3 w-16 rounded bg-gray-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 cursor-pointer"
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      {getGroupIcon(group)}
                    </div>
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {group.name}
                        </h3>
                        {group.credentialGroupTypeId && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCredentialGroupTypeBgColor(
                              getCredentialGroupTypeName(
                                group.credentialGroupTypeId
                              )
                            )} ${getCredentialGroupTypeColor(
                              getCredentialGroupTypeName(
                                group.credentialGroupTypeId
                              )
                            )}`}
                          >
                            {(() => {
                              const TypeIcon = getCredentialGroupTypeIcon(
                                getCredentialGroupTypeName(
                                  group.credentialGroupTypeId
                                )
                              );
                              return <TypeIcon size={12} />;
                            })()}
                            {getCredentialGroupTypeName(
                              group.credentialGroupTypeId
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {getCredentialCount(group.id)}{" "}
                        {getCredentialCount(group.id) === 1
                          ? "Credential"
                          : "Credentials"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Credentials Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedGroupId
              ? `Credentials in ${
                  breadcrumbPath[breadcrumbPath.length - 1]?.name || "Group"
                }`
              : "All Credentials"}
          </h2>
          {selectedGroupId && (
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all"
              onClick={handleCreateCredential}
            >
              <Plus size={14} />
              <span className="text-xs font-medium">New Credential</span>
            </Button>
          )}
        </div>

        {credentialsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 w-32 rounded bg-gray-200 mb-2" />
                      <div className="h-3 w-20 rounded bg-gray-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCredentials.map((credential, index) => {
              // Her credential için benzersiz ID oluştur
              const uniqueId = getCredentialUniqueId(credential, index);
              const isExpanded = expandedCredentials[uniqueId];
              const hasParameters =
                credential.parameters &&
                Object.keys(credential.parameters).length > 0;

              return (
                <Card key={uniqueId} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {getCredentialIcon(credential)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {credential.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getConnectionInfo(credential)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {hasParameters && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  toggleCredentialExpansion(uniqueId)
                                }
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCredential(credential);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCredential(credential);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Parameters - Only show when expanded */}
                        {isExpanded && hasParameters && (
                          <div className="mt-3 space-y-1">
                            {Object.entries(credential.parameters).map(
                              ([key, value]) => {
                                if (key === "index") return null; // Skip index parameter
                                const isPassword =
                                  key.toLowerCase().includes("password") ||
                                  key.toLowerCase().includes("secret");
                                const isVisible =
                                  passwordVisibility[`${uniqueId}-${key}`];

                                return (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between bg-gray-50 rounded px-2 py-1"
                                  >
                                    <span className="text-xs text-gray-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}:
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs font-mono text-gray-800">
                                        {isPassword && !isVisible
                                          ? "••••••••"
                                          : String(value)}
                                      </span>
                                      {isPassword && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() =>
                                            togglePasswordVisibility(
                                              uniqueId,
                                              key
                                            )
                                          }
                                        >
                                          {isVisible ? (
                                            <EyeOff className="h-3 w-3" />
                                          ) : (
                                            <Eye className="h-3 w-3" />
                                          )}
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() =>
                                          handleCopyParameter(
                                            String(value),
                                            key
                                          )
                                        }
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!credentialsLoading && filteredCredentials.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gray-100 p-3">
              <Server className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedGroupId
                ? "No credentials in this group"
                : "No credentials found"}
            </h3>
            <p className="text-gray-500">
              {selectedGroupId
                ? "This group doesn't contain any credentials yet."
                : "Get started by creating your first credential."}
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {showCreateGroup && (
        <CreateCredentialGroupForm
          open={showCreateGroup}
          onOpenChange={setShowCreateGroup}
          parentGroupId={selectedGroupId}
        />
      )}

      {showEditGroup && editingGroup && (
        <EditCredentialGroupForm
          open={showEditGroup}
          onOpenChange={setShowEditGroup}
          group={editingGroup}
        />
      )}

      {showCreateCredential &&
        selectedGroupId &&
        (() => {
          const allGroups = getAllGroups(credentialGroups || []);
          const selectedGroup = allGroups.find((g) => g.id === selectedGroupId);

          if (!selectedGroup) return null;

          return (
            <CreateCredentialForm
              open={showCreateCredential}
              onOpenChange={setShowCreateCredential}
              credentialGroupId={selectedGroupId}
              credentialGroupTypeId={selectedGroup.credentialGroupTypeId}
              credentialGroupName={selectedGroup.name}
            />
          );
        })()}

      {showEditCredential && editingCredential && (
        <EditCredentialForm
          credential={editingCredential}
          open={showEditCredential}
          onOpenChange={setShowEditCredential}
        />
      )}
    </div>
  );
}
