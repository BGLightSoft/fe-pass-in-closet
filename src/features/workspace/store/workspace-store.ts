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
  isInitialized: boolean;
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  initializeWorkspace: (workspaces: Workspace[]) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set) => ({
        currentWorkspace: null,
        workspaces: [],
        isInitialized: false,

        setCurrentWorkspace: (workspace) => {
          localStorage.setItem("workspace_id", workspace.id);
          set({ currentWorkspace: workspace, isInitialized: true });
        },

        setWorkspaces: (workspaces) => {
          set((state) => {
            // Only update workspaces list, preserve current selection
            // If current workspace is no longer in the list, clear it
            const currentStillExists = state.currentWorkspace
              ? workspaces.some((w) => w.id === state.currentWorkspace?.id)
              : false;

            return {
              workspaces,
              currentWorkspace: currentStillExists
                ? state.currentWorkspace
                : null,
            };
          });
        },

        initializeWorkspace: (workspaces) => {
          set((state) => {
            // Only auto-select if no workspace is currently selected
            if (state.currentWorkspace) {
              return { workspaces, isInitialized: true };
            }

            // Find default workspace or first workspace
            const defaultWorkspace =
              workspaces.find((w) => w.isDefault) || workspaces[0];

            if (defaultWorkspace) {
              localStorage.setItem("workspace_id", defaultWorkspace.id);
              return {
                workspaces,
                currentWorkspace: defaultWorkspace,
                isInitialized: true,
              };
            }

            return { workspaces, isInitialized: true };
          });
        },

        clearWorkspace: () => {
          localStorage.removeItem("workspace_id");
          set({ currentWorkspace: null, workspaces: [], isInitialized: false });
        },
      }),
      {
        name: "workspace-storage",
      }
    )
  )
);
