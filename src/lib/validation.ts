import { z } from "zod";

/**
 * Common validation schemas.
 */
export const schemas = {
  id: z.coerce.number().positive(),
  name: z.string().trim().max(32),
  email: z.email(),
  password: z.string().trim().min(12),
};

/**
 * Guard that the value is an object and is indexable by the given key.
 */
function isIndexable<T extends string>(
  key: T,
  value: unknown
): value is { [key in T]: unknown } {
  return typeof value === "object" && value !== null && key in value;
}

/**
 * Parse some payload using a given schema.
 */
export function parse<Shape extends z.ZodRawShape>(
  payload: unknown,
  shape: Shape
) {
  return z
    .object(shape)
    .parse(
      Object.fromEntries(
        Object.keys(shape).map((key) => [
          key,
          payload instanceof FormData
            ? payload.get(key) ?? undefined
            : payload instanceof URLSearchParams
            ? payload.get(key) ?? undefined
            : isIndexable(key, payload)
            ? payload[key]
            : undefined,
        ])
      )
    );
}
