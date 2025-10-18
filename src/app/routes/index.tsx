import { ErrorFallback } from "@/shared/ui/error-fallback";
import { PageLoader } from "@/shared/ui/page-loader";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../layouts/auth-layout";
import { RootLayout } from "../layouts/root-layout";
import { ProtectedRoute } from "./protected-route";

// Lazy load pages
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const SignUpPage = lazy(() => import("@/features/auth/pages/sign-up-page"));
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/dashboard-page")
);
const WorkspacesPage = lazy(
  () => import("@/features/workspace/pages/workspaces-page")
);
const CredentialGroupsPage = lazy(
  () => import("@/features/credential-group/pages/credential-groups-page")
);
const CredentialsPage = lazy(
  () => import("@/features/credential/pages/credentials-page")
);
const AccountSettingsPage = lazy(
  () => import("@/features/account/pages/account-settings-page")
);

export function AppRoutes() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Suspense fallback={<PageLoader />}>
                <SignUpPage />
              </Suspense>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/workspaces"
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkspacesPage />
              </Suspense>
            }
          />
          <Route
            path="/credential-groups"
            element={
              <Suspense fallback={<PageLoader />}>
                <CredentialGroupsPage />
              </Suspense>
            }
          />
          <Route
            path="/credentials/:groupId"
            element={
              <Suspense fallback={<PageLoader />}>
                <CredentialsPage />
              </Suspense>
            }
          />
          <Route
            path="/account/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccountSettingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
