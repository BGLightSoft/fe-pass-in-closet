import { apiClient } from "@/shared/api/client";
import { createResponseSchema } from "@/shared/api/response-wrapper";
import {
  type DashboardStats,
  dashboardStatsSchema,
} from "../schemas/dashboard-schemas";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/stats");
    const wrappedSchema = createResponseSchema(dashboardStatsSchema);
    return wrappedSchema.parse(response.data);
  },
};
