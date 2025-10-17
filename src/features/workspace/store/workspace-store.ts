import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Workspace {
  id: string;
  name: string | null;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set) => ({
        currentWorkspace: null,
        workspaces: [],

        setCurrentWorkspace: (workspace) => {
          localStorage.setItem("workspace_id", workspace.id);
          set({ currentWorkspace: workspace });
        },

        setWorkspaces: (workspaces) => {
          set({ workspaces });
          // Auto-select default workspace if none selected
          const defaultWorkspace = workspaces.find((w) => w.isDefault);
          if (defaultWorkspace) {
            set({ currentWorkspace: defaultWorkspace });
            localStorage.setItem("workspace_id", defaultWorkspace.id);
          }
        },

        clearWorkspace: () => {
          localStorage.removeItem("workspace_id");
          set({ currentWorkspace: null, workspaces: [] });
        },
      }),
      {
        name: "workspace-storage",
      }
    )
  )
);
