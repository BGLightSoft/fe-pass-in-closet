import { z } from "zod";

export const dashboardStatsSchema = z.object({
  totalWorkspaces: z.number(),
  totalCredentialGroups: z.number(),
  totalCredentials: z.number(),
  activeWorkspaces: z.number(),
  recentlyAddedCredentials: z.number(),
});

export const recentCredentialSchema = z.object({
  id: z.string(),
  name: z.string(),
  credentialGroupName: z.string().nullable(),
  workspaceName: z.string().nullable(),
  createdAt: z.string().or(z.date()),
});

export const quickAccessGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  credentialCount: z.number(),
  workspaceName: z.string().nullable(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type RecentCredential = z.infer<typeof recentCredentialSchema>;
export type QuickAccessGroup = z.infer<typeof quickAccessGroupSchema>;
