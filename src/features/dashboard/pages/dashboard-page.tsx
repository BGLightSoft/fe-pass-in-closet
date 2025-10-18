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
import { useCredentialGroups } from "@/features/credential-group/hooks/use-credential-groups";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
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
      description: "AES-256 encryption for all credentials",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Layers,
      title: "Organized Structure",
      description: "Group credentials by project or team",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Zap,
      title: "Quick Access",
      description: "Find and copy credentials instantly",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Activity,
      title: "Real-time Sync",
      description: "Access from anywhere, anytime",
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
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <p className="text-sm text-blue-100">
                Your credentials are secure and organized
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-gray-300 shadow-sm transition-all hover:shadow-md"
          >
            <div
              className={`absolute right-0 top-0 h-20 w-20 translate-x-4 -translate-y-4 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 transition-transform group-hover:scale-110`}
            />
            <CardContent className="relative p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600">
                    {stat.title}
                  </p>
                  {isLoading ? (
                    <div className="mt-1 h-5 w-12 animate-pulse rounded bg-gray-200" />
                  ) : (
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {stat.value}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div className={`rounded-lg ${stat.bgColor} p-1.5`}>
                  <stat.icon size={16} className={stat.textColor} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-300 shadow-sm">
        <CardContent className="p-3">
          <div className="mb-3 flex items-center gap-2">
            <Zap size={16} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="group relative overflow-hidden rounded-lg border border-gray-300 bg-white p-3 text-left transition-all hover:border-blue-400 hover:shadow-md"
              >
                <div
                  className={`mb-2 inline-flex rounded-lg bg-${action.color}-100 p-1.5`}
                >
                  <action.icon
                    size={16}
                    className={`text-${action.color}-600`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {action.description}
                </p>
                <ArrowRight
                  size={14}
                  className="absolute bottom-3 right-3 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600"
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Card className="border-gray-300 shadow-sm">
        <CardContent className="p-3">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-600" />
            <h2 className="text-base font-bold text-gray-900">
              Why Pass-in-Closet?
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-2.5 rounded-lg border border-gray-300 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div
                  className={`mb-2 inline-flex rounded-lg ${feature.bgColor} p-1.5 transition-transform group-hover:scale-105`}
                >
                  <feature.icon size={16} className={feature.color} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      {totalCredentials === 0 && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-3 inline-flex rounded-full bg-blue-100 p-3">
              <Clock size={24} className="text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Get Started with Pass-in-Closet
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Start organizing your credentials in a secure and structured way
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={() => navigate("/workspaces")}
                className="gap-2 text-sm h-8"
              >
                <FolderTree size={14} />
                Create Workspace
              </Button>
              <Button
                onClick={() => navigate("/credential-groups")}
                variant="outline"
                className="gap-2 text-sm h-8"
              >
                <Layers size={14} />
                View Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Shield size={16} className="text-green-600" />
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
