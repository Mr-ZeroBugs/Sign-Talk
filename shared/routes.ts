import { z } from "zod";
import { users, insertUserSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  health: {
    get: {
      method: "GET" as const,
      path: "/api/health" as const,
      responses: {
        200: z.object({ ok: z.literal(true) }),
      },
    },
  },
  users: {
    list: {
      method: "GET" as const,
      path: "/api/users" as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/users" as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/users/:id" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type HealthResponse = z.infer<typeof api.health.get.responses[200]>;
export type UsersListResponse = z.infer<typeof api.users.list.responses[200]>;
export type CreateUserInput = z.infer<typeof api.users.create.input>;
export type UserResponse = z.infer<typeof api.users.create.responses[201]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
