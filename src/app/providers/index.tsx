import type { ReactNode } from "react";
import { I18nProvider } from "./i18n-provider";
import { QueryProvider } from "./query-provider";
import { RouterProvider } from "./router-provider";
import { ThemeProvider } from "./theme-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <QueryProvider>
          <RouterProvider>{children}</RouterProvider>
        </QueryProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
