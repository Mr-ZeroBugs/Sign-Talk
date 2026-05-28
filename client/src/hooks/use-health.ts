import { useMutation } from "@tanstack/react-query";
import { api, type HealthResponse } from "@shared/routes";

export function useHealthCheck() {
  return useMutation({
    mutationFn: async (): Promise<HealthResponse> => {
      const res = await fetch(api.health.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Health check failed");
      const json = await res.json();
      const parsed = api.health.get.responses[200].safeParse(json);
      if (!parsed.success) {
        console.error("[Zod] health.get validation failed:", parsed.error.format());
        throw parsed.error;
      }
      return parsed.data;
    },
  });
}
