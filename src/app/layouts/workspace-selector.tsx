import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";
import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function WorkspaceSelector() {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const { data: workspaces, isLoading } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  // Her workspace item yaklaşık 70px (padding dahil)
  const maxVisibleItems = 5;
  const itemHeight = 70;
  const maxHeight =
    Math.min(workspaces?.length || 0, maxVisibleItems) * itemHeight;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading || !workspaces || workspaces.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
      >
        <span className="font-medium">
          {currentWorkspace?.name || "Select Workspace"}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="fixed z-[9999] w-64 rounded-lg border bg-white shadow-xl"
          style={{
            top: buttonRef.current
              ? buttonRef.current.getBoundingClientRect().bottom + 8
              : 0,
            left: buttonRef.current
              ? buttonRef.current.getBoundingClientRect().left
              : 0,
            maxHeight: maxHeight + 16, // padding için +16px
          }}
        >
          <div
            className="p-2 overflow-y-auto"
            style={{
              maxHeight: maxHeight,
            }}
          >
            {workspaces
              .sort((a, b) => {
                // Default workspace'i en üstte göster
                if (a.isDefault && !b.isDefault) return -1;
                if (!a.isDefault && b.isDefault) return 1;
                return 0;
              })
              .map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => {
                    setCurrentWorkspace(workspace);
                    setIsOpen(false);
                    // Invalidate credential-related queries when workspace changes
                    queryClient.invalidateQueries({
                      queryKey: ["credential-groups"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["credentials"],
                    });
                  }}
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                >
                  <div>
                    <div className="font-medium">{workspace.name}</div>
                    {workspace.isDefault && (
                      <div className="text-xs text-blue-600">Default</div>
                    )}
                  </div>
                  {currentWorkspace?.id === workspace.id && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
