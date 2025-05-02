import { z } from "zod";

function squeeze(text: string) {
  return text.replaceAll(/\s+/g, " ").trim();
}

/**
 * Common validation schemas.
 */
export const schemas = {
  id: z.coerce.number().positive(),
  name: z.string().max(24).transform(squeeze),
  email: z.email(),
  password: z.string().min(12).transform(squeeze),
  description: z.string().max(256).transform(squeeze),
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
