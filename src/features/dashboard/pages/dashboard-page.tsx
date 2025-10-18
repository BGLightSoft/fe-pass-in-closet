import { Card, CardContent } from "@/shared/ui/card";
import {
  Shield,
  FolderTree,
  Key,
  Layers,
  TrendingUp,
  Clock,
  Lock,
  Zap,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";
import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";
import { useCredentialGroups } from "@/features/credential-group/hooks/use-credential-groups";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { currentWorkspace } = useWorkspaceStore();
  const { data: credentialGroups, isLoading: isLoadingGroups } =
    useCredentialGroups();

  // Calculate stats
  const totalWorkspaces = workspaces?.length || 0;
  const activeWorkspaces = workspaces?.filter((w) => w.isActive).length || 0;
  const totalGroups = credentialGroups?.length || 0;

  // Calculate total credentials recursively
  const calculateTotalCredentials = (groups: any[]): number => {
    return groups.reduce((total, group) => {
      const groupTotal = group.totalCredentialCount || 0;
      return total + groupTotal;
    }, 0);
  };

  const totalCredentials = credentialGroups
    ? calculateTotalCredentials(credentialGroups)
    : 0;

  const isLoading = isLoadingWorkspaces || isLoadingGroups;

  // Stats cards data
  const stats = [
    {
      title: "Total Credentials",
      value: totalCredentials,
      icon: Key,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: "Securely stored",
    },
    {
      title: "Workspaces",
      value: totalWorkspaces,
      icon: FolderTree,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: `${activeWorkspaces} active`,
    },
    {
      title: "Credential Groups",
      value: totalGroups,
      icon: Layers,
      color: "green",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Organized collections",
    },
    {
      title: "Security Status",
      value: "🛡️",
      icon: Shield,
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      description: "All encrypted",
    },
  ];

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "Your credentials are encrypted with industry-standard AES-256",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Layers,
      title: "Organized Structure",
      description: "Group your credentials by project, team, or category",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Zap,
      title: "Quick Access",
      description: "Find and copy your credentials in seconds",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Activity,
      title: "Real-time Sync",
      description: "Access your credentials from anywhere, anytime",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const quickActions = [
    {
      title: "Create Workspace",
      description: "Set up a new workspace",
      icon: FolderTree,
      color: "blue",
      onClick: () => navigate("/workspaces"),
    },
    {
      title: "Add Credentials",
      description: "Store new passwords",
      icon: Key,
      color: "green",
      onClick: () => navigate("/credential-groups"),
    },
    {
      title: "Manage Groups",
      description: "Organize your credentials",
      icon: Layers,
      color: "purple",
      onClick: () => navigate("/credential-groups"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-32 -translate-y-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-32 translate-y-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-white/20 p-2.5 backdrop-blur-sm">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-blue-100">
                Your credentials are secure and organized
              </p>
            </div>
          </div>

          {currentWorkspace && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
              <FolderTree size={16} />
              <span className="text-sm">
                Current Workspace:{" "}
                <span className="font-semibold">{currentWorkspace.name}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-md transition-all hover:shadow-xl"
          >
            <div
              className={`absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 transition-transform group-hover:scale-110`}
            />
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  {isLoading ? (
                    <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200" />
                  ) : (
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div className={`rounded-xl ${stat.bgColor} p-3`}>
                  <stat.icon size={24} className={stat.textColor} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Zap size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-100 bg-white p-6 text-left transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex rounded-lg bg-${action.color}-100 p-3`}
                >
                  <action.icon
                    size={24}
                    className={`text-${action.color}-600`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {action.description}
                </p>
                <ArrowRight
                  size={20}
                  className="absolute bottom-6 right-6 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Why Pass-in-Closet?
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div
                  className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3 transition-transform group-hover:scale-110`}
                >
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      {totalCredentials === 0 && (
        <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-blue-100 p-4">
              <Clock size={32} className="text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Get Started with Pass-in-Closet
            </h3>
            <p className="mb-6 text-gray-600">
              Start organizing your credentials in a secure and structured way
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate("/workspaces")} className="gap-2">
                <FolderTree size={16} />
                Create Workspace
              </Button>
              <Button
                onClick={() => navigate("/credential-groups")}
                variant="outline"
                className="gap-2"
              >
                <Layers size={16} />
                View Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield size={20} className="text-green-600" />
          <p>
            <span className="font-semibold text-gray-900">
              Your data is secure.
            </span>{" "}
            All credentials are encrypted using AES-256 encryption and stored
            securely in our infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
}
