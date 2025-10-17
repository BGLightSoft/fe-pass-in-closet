import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";

export function RootLayout() {
  const { data: workspaces, isLoading } = useWorkspaces();

  useEffect(() => {
    console.log("🔍 Workspace Debug:", {
      workspaces,
      count: workspaces?.length || 0,
      isLoading,
      localStorage: {
        workspace_id: localStorage.getItem("workspace_id"),
        workspace_storage: localStorage.getItem("workspace-storage"),
      },
    });
  }, [workspaces, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">
            No workspaces found
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please create a workspace first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
