import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Theme logic can be added here (dark mode, etc.)
  return <>{children}</>;
}
