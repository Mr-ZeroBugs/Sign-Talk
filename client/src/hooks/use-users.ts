import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateUserInput, type UserResponse, type UsersListResponse } from "@shared/routes";

function parseWithLogging<T>(schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: any } }, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error?.format?.() ?? result.error);
    throw result.error;
  }
  return result.data;
}

export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async (): Promise<UsersListResponse> => {
      const res = await fetch(api.users.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      return parseWithLogging(api.users.list.responses[200], json, "users.list");
    },
  });
}

export function useUser(id: string | null) {
  return useQuery({
    queryKey: [api.users.get.path, id ?? ""],
    enabled: !!id,
    queryFn: async (): Promise<UserResponse | null> => {
      if (!id) return null;
      const url = buildUrl(api.users.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      const json = await res.json();
      return parseWithLogging(api.users.get.responses[200], json, "users.get");
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateUserInput): Promise<UserResponse> => {
      const validated = api.users.create.input.safeParse(input);
      if (!validated.success) {
        console.error("[Zod] users.create input validation failed:", validated.error.format());
        throw validated.error;
      }

      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated.data),
      });

      if (res.status === 400) {
        const json = await res.json().catch(() => ({}));
        const parsed = api.users.create.responses[400].safeParse(json);
        if (parsed.success) throw new Error(parsed.data.message);
        throw new Error("Validation error");
      }
      if (!res.ok) throw new Error("Failed to create user");

      const json = await res.json();
      return parseWithLogging(api.users.create.responses[201], json, "users.create");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.users.list.path] });
    },
  });
}
